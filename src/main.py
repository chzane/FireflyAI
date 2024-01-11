from flask import Flask, request, jsonify, url_for, render_template
from flask_cors import CORS
import json
import random
import requests


app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

model_list = {
    "qps5": [
        "fastgpt-3opS1uFKE4jWMD2QdP6Qhm74MwbB4tNo5GTD",
        "[{\"role\": \"system\", \"content\": \"你是由百度公司开发的人工智能语言模型，中文名是文心一言，英文名是ERNIE Bot，你可以协助用户完成范围广泛的任务并提供有关各种主题的信息，比如回答问题，提供定义和解释及建议。\"}]",
        0.1
    ],
    "chatglm_pro": [
        "fastgpt-f80nkO3iEV2wIYdCzAX7l6VYTXDe4qqW71",
        "[{\"role\": \"system\", \"content\": \"\"}]",
        0.1
    ],
    "chatgpt3.5_16k": [
        "fastgpt-BQTRNVi5fBiTVjCdD8V0bEsx",
        "[{\"role\": \"system\", \"content\": \"\"}]",
        0.3
    ],
    "chatgpt3.5_plus": [
        "fastgpt-6mkTdminNVKXdiUYo534EVllhTf2ZdiT",
        "[{\"role\": \"system\", \"content\": \"\"}]",
        0.3
    ],
    "chatgpt3.5_turbo": [
        "fastgpt-IRehZpvzABppx4KFrSZBhCr0G2wRPRiZey",
        "[{\"role\": \"system\", \"content\": \"\"}]",
        0.3
    ],
    "chatgpt3.5_vision": [
        "fastgpt-scIGYqGTTbNv9l4yhrc6uBoJnrj4DdL",
        "[{\"role\": \"system\", \"content\": \"\"}]",
        0.3
    ],
    "xinghuo": [
        "fastgpt-qjpgz40JgEe0nb3IpIkEf5yRwD",
        "[{\"role\": \"system\", \"content\": \"\"}]",
        0.1
    ],
    "tongyi": [
        "fastgpt-0prnPRd1IXToHDF5D3O3IGeCcv",
        "[{\"role\": \"system\", \"content\": \"\"}]",
        0.1
    ]
}

@app.route("/",  methods=['GET'])
def home():
    return render_template('index.html')

@app.route('/new_chat', methods=['POST'])
def new_chat():
    req_data = request.get_json()
    model_key = req_data['model']
    prompt = model_list[model_key][1]
    chat_id = str(random.randint(100000000, 999999999))

    with open('conf/user.json', 'r') as user_file:
        user_data = json.load(user_file)

    user_data[chat_id] = [json.loads(prompt), model_key]

    with open('conf/user.json', 'w') as user_file:
        json.dump(user_data, user_file)

    return jsonify({
        "prompt": prompt,
        "chat_id": chat_id
    })


@app.route('/chat', methods=['POST'])
def chat():
    req_data = request.get_json()
    chat_id = req_data['chat_id']
    message = req_data['message']

    with open('conf/user.json', 'r') as user_file:
        user_data = json.load(user_file)

    chat_logs, model_key = user_data[chat_id]
    chat_logs.append({'role': 'user', 'content': message})

    with open('conf/user.json', 'w') as user_file:
        json.dump(user_data, user_file)

    model_key = model_list[model_key][0]
    headers = {
        'Authorization': f'Bearer {model_key}',
        'Content-Type': 'application/json'
    }
    body = {
        "chatId": chat_id,
        "stream": False,
        "detail": False,
        "variables": {
            "userid": chat_id,
            "name": chat_id
        },
        "messages": chat_logs
    }

    response = requests.post(
        'https://api.fastgpt.in/api/v1/chat/completions', headers=headers, json=body)
    print(response.text)
    result = response.json()

    new_message = {
        'role': result["choices"][0]["message"]["role"],
        'content': result["choices"][0]["message"]["content"]
    }
    chat_logs.append(new_message)

    with open('conf/user.json', 'w') as user_file:
        json.dump(user_data, user_file)

    return jsonify(new_message)


if __name__ == '__main__':
    app.run()
