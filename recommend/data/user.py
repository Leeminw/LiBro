class User:
    id : int
    auth_id : int
    auth_type : str
    email : str
    name : str
    profile : str
    role : str

    def __init__(self, id: int, auth_id: int, auth_type: str, email: str, 
                 name: str, profile: str, role: str):
        self.id = id
        self.auth_id = auth_id
        self.auth_type = auth_type
        self.email = email
        self.name = name
        self.profile = profile
        self.role = role