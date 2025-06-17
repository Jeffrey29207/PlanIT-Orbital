import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.linear_model import Ridge, RidgeCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import QuantileTransformer
from sklearn.model_selection import GridSearchCV

pipe = Pipeline([
    ('scaler', QuantileTransformer(output_distribution='normal')),
    ('model', Ridge())
])

print(pipe.get_params())


model = GridSearchCV(
    estimator=pipe,
    param_grid={'model__alpha': np.logspace(-3,3, 10)},
    cv=5
)

