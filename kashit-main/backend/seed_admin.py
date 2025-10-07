from main import create_app
from models import db, User


def seed_admin(email: str = "admin@example.com", password: str = "Admin@123", full_name: str = "Admin") -> None:
    app = create_app()
    with app.app_context():
        existing = User.query.filter_by(email=email).first()
        if existing:
            print(f"Admin already exists: {email}")
            return
        admin_user = User(email=email, full_name=full_name)
        admin_user.set_password(password)
        admin_user.is_verified = True
        admin_user.is_admin = True
        db.session.add(admin_user)
        db.session.commit()
        print(f"Admin created: {email} / {password}")


if __name__ == "__main__":
    seed_admin()


