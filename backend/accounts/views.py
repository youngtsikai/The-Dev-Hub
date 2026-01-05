from rest_framework.views import APIView
from rest_framework.generics import ListAPIView 
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token 
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model 
from django.core.files.base import ContentFile 
from .serialisers import UserSerializer, RegisterSerializer
from .models import Quest
import requests
from datetime import datetime, timedelta
from collections import Counter

User = get_user_model() 

class RegisterView(APIView):
    permission_classes = [] 

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                "message": "User registered successfully",
                "user": UserSerializer(user).data,
                "token": token.key
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    permission_classes = [] 

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            serializer = UserSerializer(user)
            return Response({
                "message": "Login successful",
                "user": serializer.data,
                "token": token.key 
            }, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class LeaderboardView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_queryset(self):
               return User.objects.order_by('-current_xp')[:20]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_quest(request, quest_id):
    try:
        quest = Quest.objects.get(id=quest_id, user=request.user)
        
        if quest.status == 'completed':
            return Response({'error': 'Quest already completed'}, status=400)

        quest.status = 'completed'
        quest.save()

        user = request.user
        user.current_xp += quest.xp_reward
        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data)

    except Quest.DoesNotExist:
        return Response({'error': 'Quest not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sync_github_stats(request):
    try:
        user = request.user
        if not user.github_username:
            return Response({'error': 'No GitHub username linked.'}, status=400)

        # 1. Fetch Profile
        profile_url = f"https://api.github.com/users/{user.github_username}"
        profile_res = requests.get(profile_url)
        if profile_res.status_code != 200:
             return Response({'error': 'GitHub user not found.'}, status=404)
        profile_data = profile_res.json()

        # 2. Fetch Activity
        events_url = f"https://api.github.com/users/{user.github_username}/events/public?per_page=100"
        events_res = requests.get(events_url)
        events_data = events_res.json() if events_res.status_code == 200 else []

        # 3. Fetch Repos (For Languages)
        repos_url = f"https://api.github.com/users/{user.github_username}/repos?per_page=100&sort=updated"
        repos_res = requests.get(repos_url)
        repos_data = repos_res.json() if repos_res.status_code == 200 else []

        # --- CALCULATE LANGUAGES ---
        languages_list = [repo['language'] for repo in repos_data if repo['language']]
        language_counts = dict(Counter(languages_list)) 

        # --- EXISTING VELOCITY LOGIC ---
        recent_commits = 0
        prs_merged = 0
        issues_closed = 0
        today = datetime.now().date()
        velocity_map = { (today - timedelta(days=i)).isoformat(): 0 for i in range(6, -1, -1) }

        for event in events_data:
            type = event.get('type')
            payload = event.get('payload', {})
            created_at = event.get('created_at')

            if created_at:
                date_str = created_at.split('T')[0]
                if date_str in velocity_map:
                    if type == 'PushEvent':
                        count = payload.get('size', 1)
                        velocity_map[date_str] += count
                    elif type in ['PullRequestEvent', 'IssuesEvent']:
                         velocity_map[date_str] += 1

            if type == 'PushEvent':
                recent_commits += payload.get('size', 1)
            elif type == 'PullRequestEvent':
                if payload.get('action') == 'closed' and payload.get('pull_request', {}).get('merged') == True:
                    prs_merged += 1
            elif type == 'IssuesEvent':
                if payload.get('action') == 'closed':
                    issues_closed += 1
        
        velocity_data = list(velocity_map.values())

        # Update Database
        github_name = profile_data.get('name')
        if github_name:
            parts = github_name.split()
            if len(parts) >= 1: user.first_name = parts[0]
            if len(parts) >= 2: user.last_name = " ".join(parts[1:])
        
        if profile_data.get('bio'): user.bio = profile_data.get('bio')

        avatar_url = profile_data.get('avatar_url')
        if avatar_url:
            img_res = requests.get(avatar_url)
            if img_res.status_code == 200:
                user.avatar.save(f"{user.username}_avatar.jpg", ContentFile(img_res.content), save=False)

        base_score = profile_data.get('public_repos', 0) * 2 
        user.total_commits = base_score + recent_commits
        user.prs_merged = prs_merged
        user.bugs_fixed = issues_closed
        
        # XP & Ranking
        activity_xp = (user.total_commits * 10) + (user.prs_merged * 50) + (user.bugs_fixed * 30)
        if activity_xp > user.current_xp:
             user.current_xp = activity_xp

        xp_per_level = 200 
        user.level = int(user.current_xp / xp_per_level) + 1
        
        if user.level < 5: user.title = "Junior Developer"
        elif user.level < 10: user.title = "Senior Engineer"
        elif user.level < 20: user.title = "Tech Lead"
        else: user.title = "10x Developer"
            
        user.streak_days += 1
        user.save()

        response_data = UserSerializer(user).data
        response_data['velocity'] = velocity_data
        response_data['languages'] = language_counts 

        return Response(response_data)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=500)