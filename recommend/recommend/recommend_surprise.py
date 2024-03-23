from surprise import Dataset, Reader
from surprise import KNNBasic
from surprise.model_selection import train_test_split
from surprise import accuracy

# 데이터 불러오기
reader = Reader(rating_scale=(1, 5))
data = Dataset.load_from_file('ratings.csv', reader)

# 학습 데이터와 테스트 데이터로 나누기
trainset, testset = train_test_split(data, test_size=0.2)

# 유사도 기반 모델 생성 및 학습
sim_options = {'name': 'cosine', 'user_based': True}
model = KNNBasic(sim_options=sim_options)
model.fit(trainset)

# 예측 수행
predictions = model.test(testset)

# 성능 측정
accuracy.rmse(predictions)
accuracy.mae(predictions)

# 특정 사용자에 대한 추천 예측
user_id = 1
items_to_recommend = []
for item_id in range(1, 100):  # 예측할 아이템 범위 설정
    prediction = model.predict(str(user_id), str(item_id))
    items_to_recommend.append((item_id, prediction.est))

# 추천 아이템 출력
top_items = sorted(items_to_recommend, key=lambda x: x[1], reverse=True)[:10]
print("Top 10 Recommended Items for User {}: ".format(user_id))
for item in top_items:
    print("Item ID: {}, Estimated Rating: {}".format(item[0], item[1]))