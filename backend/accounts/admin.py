from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import DevUser, Quest

class DevUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Identity', {'fields': ('title', 'bio', 'avatar', 'github_username')}), 
        ('Gamification Stats', {'fields': ('current_xp', 'level', 'streak_days')}),
        ('Dashboard Metrics', {'fields': ('total_commits', 'prs_merged', 'bugs_fixed', 'focus_hours')}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Identity', {'fields': ('title', 'bio', 'avatar', 'github_username')}),
    )

admin.site.register(DevUser, DevUserAdmin)
admin.site.register(Quest)