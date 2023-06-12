from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

app = Flask(
    __name__,
    static_url_path="/",
    template_folder="client/template",
    static_folder="client/static",
)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JSON_SORT_KEYS"] = False
app.config["JWT_SECRET_KEY"] = "all_makt_at_tengil"
app.config[
    "STRIPE_PUBLIC_KEY"
] = "pk_test_51IfhsnIyy0hEGyMV6el0guHYj3vjLOrWxGAm20PYjYoKShwT23BnI394bnimktnu6BBDXwRchEBC4axfyznA0RiO00OWmDzv5Z"
app.config[
    "STRIPE_SECRET_KEY"
] = "sk_test_51IfhsnIyy0hEGyMVuSVpG7skqR7QUv0vLcE3Yq9fZ1CnrpHVFd7RC2LmNTfHf9I2laBnVFkj91hjasAcF1DemgDO00vKUDz9Qn"
app.config["PDF_FILE_UPLOADS"] = "app/client/static/resumes"
app.config["ALLOWED_PDF_FILE_EXTENSIONS"] = ["PDF"]
app.config["MAX_PDF_FILE_FILESIZE"] = 3 * 1024 * 1024

db = SQLAlchemy(app)
jwt = JWTManager(app)

from app import routes