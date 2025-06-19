import pandas as pd
import numpy as np
import matplotlib.pylab as plt
from IPython.display import display

from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import QuantileTransformer
from sklearn.model_selection import GridSearchCV


pipe = Pipeline([
    ('scaler', QuantileTransformer(output_distribution='normal')),
    ('model', RandomForestRegressor(max_depth=None))
])

model = GridSearchCV(
    estimator=pipe,
    param_grid={'model__n_estimators': np.linspace(0,100, 50)},
    cv=10,
    n_jobs=-1
)



