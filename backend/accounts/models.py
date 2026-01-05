from django.db import models
from django.contrib.auth.models import AbstractUser

class DevUser(AbstractUser):
    # Identity
    title = models.CharField(max_length=100, default="Junior Developer")
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    bio = models.TextField(max_length=500, blank=True)
    github_username = models.CharField(max_length=100, blank=True, null=True)

    # Gamification Stats
    current_xp = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    
    # Dashboard Metrics 
    streak_days = models.IntegerField(default=1)
    total_commits = models.IntegerField(default=0)
    prs_merged = models.IntegerField(default=0)
    bugs_fixed = models.IntegerField(default=0)
    focus_hours = models.FloatField(default=0.0)
    
    def __str__(self):
        return self.username

class Quest(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    xp_reward = models.IntegerField(default=50)
    is_active = models.BooleanField(default=True)
    
    
    # Simple formatting: "pending", "completed"
    status = models.CharField(max_length=20, default="pending") 
    progress = models.IntegerField(default=0) # 0 to 100
    
    # Link quest to a specific user
    user = models.ForeignKey(DevUser, on_delete=models.CASCADE, related_name="quests")

    def __str__(self):
        return f"{self.title} ({self.user.username})"