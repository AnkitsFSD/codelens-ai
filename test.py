name = "Developer"
skills = ["Javascript","react","Node" ]
# New Skill add 
skills.append("Python")

user_profile = {
    "name":name,
    "skills-count": len(skills),
    "ready_to_build": True
}
print ("--- Python Test Run ---")
print(f"User: {user_profile['name']}")
print(f"Skills: {skills}")
print(f"Ready: {user_profile['ready_to_build']}")