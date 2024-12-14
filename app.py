from flask import Flask, jsonify
import os
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 启用CORS

# 加载JSON数据
def load_data():
    with open('data.json', 'r', encoding='utf-8') as f:
        return json.load(f)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "API is running"})

@app.route('/api/data', methods=['GET'])
def get_data():
    try:
        data = load_data()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

port = int(os.environ.get("PORT", 5000))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port) 