import pandas as pd
import matplotlib.pylab as plt
from IPython.display import display
import pickle

from sklearn.ensemble import GradientBoostingRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import RobustScaler
from sklearn.model_selection import GridSearchCV, cross_val_score
from sklearn.metrics import r2_score
from sklearn.multioutput import MultiOutputRegressor

df_train = pd.read_csv("./Datasets/enhanced_train_spending_data.csv")
df_test = pd.read_csv("./Datasets/rl_test_spending_data.csv")
df_test2 = pd.read_csv("./Datasets/test_spending_data_1000.csv")

X_train = df_train.drop(columns=["avg_spend_week6", "balance_week6_start"])
y_train = df_train[["avg_spend_week6", "balance_week6_start"]]

X_test = df_test.drop(columns=["avg_spend_week6", "balance_week6_start"])
y_test = df_test[["avg_spend_week6", "balance_week6_start"]]

X_test2 = df_test2.drop(columns=["avg_spend_week6", "balance_week6_start"])
y_test2 = df_test2[["avg_spend_week6", "balance_week6_start"]]


pipe = Pipeline([
    ('scaler', RobustScaler()),
    ('model', MultiOutputRegressor(GradientBoostingRegressor()))
])

model = GridSearchCV(
    estimator=pipe,
    param_grid={"model__estimator__n_estimators": [number for number in range(73, 74)]},
    cv=10,
    return_train_score=False,
    n_jobs=-1
)


model.fit(X_train, y_train)
display(pd.DataFrame(model.cv_results_))
best_params = model.best_params_["model__estimator__n_estimators"]
print("Best params: ", best_params)

good_model = Pipeline([
    ('scaler', RobustScaler()),
    ('model', MultiOutputRegressor(GradientBoostingRegressor(n_estimators=best_params)))
])

good_model.fit(X_train, y_train)

def test_model(est, test_x, test_y):
    y_pred = est.predict(test_x)
    plt.scatter(y_pred[:,0], test_y["avg_spend_week6"])
    print("R Squared: ", r2_score(test_y, y_pred))
    print("Cross validation score: ", cross_val_score(est, test_x, test_y, cv=10).mean())

test_model(good_model, X_test, y_test)
test_model(good_model, X_test2, y_test2)

with open('Regressor_Model.pkl', 'wb') as f:
    pickle.dump(good_model, f)
