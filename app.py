from flask import Flask, jsonify
import os

app = Flask(__name__)

# 添加一个基础路由
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "API is working!"})

# 假设这是您的API端点示例
@app.route('/api/example', methods=['GET'])
def example():
    return jsonify({"data": "This is an example API response"})

# Render会提供PORT环境变量
port = int(os.environ.get("PORT", 5000))

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port) 