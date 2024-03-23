from lightfm import LightFM
from lightfm.datasets import fetch_movielens
from lightfm.evaluation import precision_at_k
from lightfm.cross_validation import random_train_test_split
import numpy as np
# 데이터셋 로드 (예제로는 Movielens 데이터셋 사용)
data = fetch_movielens()

# 모델 초기화
model = LightFM(loss='warp')  # 여기서 'warp'는 Weighted Approximate-Rank Pairwise loss를 의미합니다.

# 훈련 및 평가 데이터 분할
train, test = random_train_test_split(data['train'], test_percentage=0.2, random_state=42)

# 모델 학습
model.fit(train, epochs=10)

# 평가: precision at k
precision = precision_at_k(model, test, k=5).mean()

print(f'Precision at k: {precision}')

# 특정 사용자에 대한 추천 예측
user_id = 3  # 예시로 사용자 ID 3번을 선택
n_items = data['train'].shape[1]

# 모델을 사용하여 특정 사용자에 대한 추천 예측
scores = model.predict(user_id, np.arange(n_items))

# 예측된 점수를 사용하여 가장 높은 점수를 가진 상위 N개의 아이템을 선택
top_items = data['item_labels'][np.argsort(-scores)]

print(f'Top recommended items for user {user_id}: {top_items[:5]}')

# 특정 아이템에 대한 유사한 아이템 추천
item_id = 10  # 예시로 아이템 ID 10번을 선택
n_users = data['train'].shape[0]

# 모델을 사용하여 특정 아이템과 유사한 아이템 추출
scores = model.predict(np.arange(n_users), [item_id])

# 예측된 점수를 사용하여 가장 높은 점수를 가진 상위 N개의 아이템을 선택
similar_items = data['item_labels'][np.argsort(-scores)]

print(f'Similar items to item {item_id}: {similar_items[:5]}')