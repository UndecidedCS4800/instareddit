# Generated by Django 5.1 on 2024-11-19 05:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_friendrequest'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userinfo',
            name='date_of_birth',
            field=models.DateField(null=True),
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='first_name',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='last_name',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
