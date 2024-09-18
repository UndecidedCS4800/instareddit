# Generated by Django 5.1 on 2024-09-18 22:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_post_community_alter_userinfo_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='community',
            name='members',
            field=models.ManyToManyField(db_table='community_member', related_name='member_communities', to='api.user'),
        ),
    ]
