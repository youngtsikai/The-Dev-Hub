from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Quest

User = get_user_model()

@receiver(post_save, sender=User)
def create_default_quests(sender, instance, created, **kwargs):
    if created:
        # Quests are created automatically for EVERY new user
        Quest.objects.create(
            user=instance,
            title="Sync Your GitHub",
            description="Link your account to pull real stats.",
            xp_reward=50,
            status="pending"
        )
        
        Quest.objects.create(
            user=instance,
            title="First Commit",
            description="Push code to any public repository.",
            xp_reward=100,
            status="pending"
        )
        
        Quest.objects.create(
            user=instance,
            title="Bug Hunter",
            description="Close your first issue on GitHub.",
            xp_reward=150,
            status="pending"
        )