import pandas as pd
import matplotlib.pylab as plt
from IPython.display import display

from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import RobustScaler
from sklearn.model_selection import GridSearchCV, cross_val_score
from sklearn.metrics import accuracy_score, precision_score

from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

df_train = pd.read_csv("./Datasets/enhanced_train_spending_data.csv")
df_test = pd.read_csv("./Datasets/rl_test_spending_data.csv")
df_test2 = pd.read_csv("./Datasets/train_spending_data_10000.csv")

X_train = df_train.drop(columns=["avg_spend_week6", "balance_week6_start", "label"])
y_train = df_train["label"]

X_test = df_test.drop(columns=["avg_spend_week6", "balance_week6_start", "label"])
y_test = df_test["label"]

X_test2 = df_test2.drop(columns=["avg_spend_week6", "balance_week6_start", "label"])
y_test2 = df_test2["label"]


pipe = Pipeline([
    ('scaler', RobustScaler()),
    ('model', KNeighborsClassifier())
])

model = GridSearchCV(
    estimator=pipe,
    param_grid={'model__n_neighbors': [number for number in range(1,21)]},
    cv=10,
    return_train_score=True,
    n_jobs=-1
)

model.fit(X_train, y_train)
display(pd.DataFrame(model.cv_results_))
best_params = model.best_params_["model__n_neighbors"]
print("Best params: ", best_params)

good_model = Pipeline([
    ('scaler', RobustScaler()),
    ('model', KNeighborsClassifier(n_neighbors=best_params))
])

good_model.fit(X_train, y_train)

def test_model(est, test_x, test_y):
    y_pred = est.predict(test_x)
    print("Accuracy: ", accuracy_score(y_pred, test_y))
    print("Precision: ", precision_score(y_pred, test_y, average=None))
    print("Cross validation score: ", cross_val_score(est, test_x, test_y, cv=10).mean())

test_model(good_model, X_test, y_test)
test_model(good_model, X_test2, y_test2)

init_type = [('float_input', FloatTensorType([None, good_model.n_features_in_]))]
options = {type(good_model): {'output_class_labels': True, 'zipmap': False}}
onnx_model = convert_sklearn(good_model, initial_types=init_type, options=options)
with open('Classifier_Model.onnx', 'wb') as f:
    f.write(onnx_model.SerializeToString())

