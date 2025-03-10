import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base
from database import engine, get_db
from passlib.context import CryptContext
from models import User
import uuid

# Create tables
Base.metadata.create_all(bind=engine)

# Create a session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# Password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin_user():
    # Check if admin user already exists
    admin_user = db.query(User).filter(User.username == "admin").first()
    if admin_user:
        print("Admin user already exists.")
        return
    
    # Create admin user
    admin_password = "admin1234"  # Change this in production!
    hashed_password = pwd_context.hash(admin_password)
    
    admin_user = User(
        id=str(uuid.uuid4()),
        email="admin@example.com",
        username="admin",
        hashed_password=hashed_password,
        is_active=True
    )
    
    db.add(admin_user)
    db.commit()
    print("Admin user created successfully.")

def main():
    try:
        create_admin_user()
        print("Database initialized successfully.")
    except Exception as e:
        print(f"Error initializing database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
