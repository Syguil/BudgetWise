from sqlalchemy import Column, Integer, String, Float, Date
from backend.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)
    montant = Column(Float)
    categorie = Column(String)
    date = Column(Date)
    description = Column(String)
    tags = Column(String)  # JSON encodé
