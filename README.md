# ThyroXAI
# 🧠 ThyroXAI  
### An Explainable AI Framework for Predicting Recurrence in Differentiated Thyroid Cancer

---

## 📌 Overview

ThyroXAI is an end-to-end machine learning framework developed to predict recurrence in differentiated thyroid cancer (DTC) using structured clinical and biochemical data.

The objective of this project goes beyond achieving high predictive accuracy. It focuses on building a system that is **interpretable, transparent, and clinically meaningful**. Instead of behaving like a black-box model, ThyroXAI explains its predictions and supports them with contextual insights derived from similar patient cases.

By integrating ensemble learning, explainable AI, and retrieval-based reasoning, the framework aims to assist clinicians in making more informed and trustworthy decisions.

---

## 🚀 Key Contributions

- Hybrid class imbalance handling using **SMOTEENN**
- Comparative evaluation of multiple machine learning models  
- Selection of **ExtraTrees classifier** as the final model based on performance and robustness  
- Feature selection using **Mutual Information (MI) + Recursive Feature Elimination (RFE)**  
- Model interpretability using **SHAP (Shapley Additive Explanations)**  
- Context-aware reasoning using a **Retrieval-Augmented (RAG) module**  

---

## 📊 Dataset

The dataset consists of clinical, biochemical, and demographic features such as:

- Age, Gender, Country  
- Family History, Radiation Exposure  
- Lifestyle factors (Smoking, Obesity, Diabetes)  
- Hormone levels (TSH, T3, T4)  
- Nodule Size and Risk Classification  

The dataset is imbalanced, with a higher proportion of benign cases compared to malignant cases, making class balancing an important step in the pipeline.

---

## ⚙️ Methodology

The ThyroXAI pipeline follows a structured workflow:

### 1. Data Preprocessing
- Encoding categorical features into numerical form  
- Standardizing continuous variables using Z-score normalization  

### 2. Class Imbalance Handling
- SMOTE (synthetic oversampling)  
- ENN (noise removal)  

### 3. Feature Selection
- Mutual Information (MI) to identify relevant features  
- Recursive Feature Elimination (RFE) to select optimal subset  

### 4. Model Training
Multiple models were trained and evaluated:
- Decision Tree  
- Random Forest  
- XGBoost  
- CatBoost  
- Histogram Gradient Boosting  
- TabNet  
- Artificial Neural Networks  

### 5. Final Model Selection
The **ExtraTrees classifier** was selected as the final model due to its:
- Strong generalization  
- Stability across feature subsets  
- Balanced precision and recall  

### 6. Explainability
- SHAP is used to provide both global and local feature importance  
- Enables understanding of how features influence predictions  

### 7. RAG-Based Reasoning
- Retrieves similar historical patient cases  
- Provides contextual explanations to support predictions  

---

## 📈 Model Performance Comparison

| Model                    | Accuracy (%) | Precision (%) | Recall (%) | F1 Score (%) |
|--------------------------|-------------|---------------|------------|--------------|
| ExtraTrees               | **95.87**   | **95.26**     | **95.80**  | **95.52**    |
| Random Forest            | 93.05       | 91.81         | 93.90      | 92.61        |
| CatBoost                 | 92.06       | 90.80         | 93.54      | 91.65        |
| XGBoost                  | 89.77       | 88.65         | 91.72      | 89.35        |
| HistGradient Boosting    | 88.05       | 87.20         | 90.42      | 87.64        |
| Decision Tree            | 85.51       | 84.34         | 83.79      | 84.05        |
| Artificial Neural Network| 77.73       | 75.96         | 77.43      | 76.42        |
| TabNet                   | 75.82       | 78.41         | 80.42      | 75.68        |
| AdaBoost                 | 71.63       | 68.89         | 66.68      | 67.29        |

The ExtraTrees model achieved the best overall performance and was selected as the final model.

---

## 🧠 Explainability

Interpretability is a core component of ThyroXAI:

- **SHAP** highlights the most influential features affecting predictions  
- Provides both local (patient-level) and global insights  
- Helps align model decisions with clinical reasoning  

The **RAG module** further enhances this by retrieving similar past patient cases, enabling predictions to be supported with real-world evidence rather than isolated outputs.

---

## 🧩 System Pipeline

🔍 Example Output
Recurrence Prediction: Benign / Malignant
SHAP-based feature contribution
Retrieved similar patient cases (RAG-based explanation)

👨‍💻 Authors & Future Work
Authors
Bajantri Chikulaguri Tulasi Ram
Venkata Sai Siddardh Seera
Vaishnavi Jayaraman (Assistant Professor)

Future Work
Deep exploration of Advanced RAG pipelines using vector databases (FAISS, ChromaDB)
Integration of Neural Network architectures for improved representation learning
Development of Agentic AI systems for autonomous and interactive clinical reasoning
Extension towards real-time clinical decision support systems
📜 Research Reference

"ThyroXAI: An Explainable AI Framework for Early Prediction of Differentiated Thyroid Cancer Recurrence"
