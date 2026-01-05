from django.urls import path
from .views import LoginView, complete_quest, sync_github_stats, RegisterView, LeaderboardView


urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('quests/<int:quest_id>/complete/', complete_quest, name='complete_quest'),
    path('github/sync/', sync_github_stats, name='sync_github'),
    path('leaderboard/', LeaderboardView.as_view(), name='leaderboard')
]


    