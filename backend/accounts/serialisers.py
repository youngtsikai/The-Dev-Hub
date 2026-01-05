from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Quest
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'github_username']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            github_username=validated_data.get('github_username')
        )
        return user

class QuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quest
        fields = ['id', 'title', 'description', 'xp_reward', 'status', 'progress']

class UserSerializer(serializers.ModelSerializer):
    quests = QuestSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'title', 'avatar', 'bio', 'github_username', 
            'current_xp', 'level', 
            'streak_days', 'total_commits', 'prs_merged', 'bugs_fixed', 'focus_hours',
            'quests',
            'date_joined'
        ]
        read_only_fields = ['date_joined']

        