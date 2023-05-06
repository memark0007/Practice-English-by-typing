
import json
import requests

class WordData:
    def __init__(self, word, part_of_speech, level):
        self.word = word
        self.meaning = {'partOfSpeech': part_of_speech, 'level': level}

    def __repr__(self):
        return f"word: {self.word}, meaning: {self.meaning}"

def readFile():
    word_data_list = []
    with open('The Oxford 3000 full.txt', 'r', encoding='utf-8') as file:
        lines = file.readlines()
        for line in lines:
            # แยกข้อมูลออกเป็น word, partOfSpeech, และ level
            data = line.strip().split(' ')
            word = data[0]
            partOfSpeech = data[1][:-1]  # เอาตัวหนังสือออกจากตัวหลังสุด (.)
            level = data[2:]

            # สร้าง object WordData แล้วเพิ่มลงใน list
            word_data = WordData(word, partOfSpeech, level)
            word_data_list.append(word_data)

    # สร้าง dictionary ตามที่ต้องการ
    result = {"vocabulary": [word_data.__dict__ for word_data in word_data_list]}

    # บันทึกเป็นไฟล์ JSON
    with open('vocabulary.json', 'w', encoding='utf-8') as json_file:
        json.dump(result, json_file, ensure_ascii=False, indent=4)

    # พิมพ์ข้อมูลที่อ่านมาจากไฟล์
    print(json.dumps(result, ensure_ascii=False, indent=4))
    

def makeWordToJson(word_list):

    # Initialize an empty dictionary to store all the API responses
    all_responses = {}
    wordsError = []    
    with open('vocabulary.json', 'r', encoding='utf-8') as file:
        dataR = json.load(file)
            
    for index, word in enumerate(word_list):
        # Make a request to the API
        url = f'https://api.dictionaryapi.dev/api/v2/entries/en/{word}'
        response = requests.get(url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Parse the JSON data from the response
            api_data = response.json()

            # Add the API response to the all_responses dictionary
            all_responses[word] = api_data
            dataR[word] = api_data
            print(f"API response for {index}: '{word}' fetched successfully")
        else:
            print(f"Error: Could not fetch data from the API for {index}: '{word}'")
            wordsError.append([index, word])

    # Save all the responses to a single JSON file
    # with open('all_responses.json', 'w') as json_file:
    #     json.dump(all_responses, json_file)

            
    with open('all_responsesV2.json', 'w', encoding='utf-8') as json_file:
        json.dump(dataR, json_file, ensure_ascii=False, indent=2)
    print("All API responses saved to all_responses.json")
    
    data = {'words': wordsError}
    # Save the dictionary as a JSON file
    with open('words.json', 'w', encoding='utf-8') as json_file:
        json.dump(data, json_file, ensure_ascii=False)
    print("Words saved to words.json")
    
    
    
def getWord():
    # Read the JSON file
    with open('words.json', 'r', encoding='utf-8') as json_file:
        data = json.load(json_file)

    # Extract the words from the JSON data
    word_list = [entry[1] for entry in data]

    # Print the word_list to verify the result
    print(word_list)
    return word_list

def textToJson():
    import json

    # อ่านไฟล์ข้อความและแปลงเป็น list
    with open("The Oxford 3000.txt", "r", encoding="utf-8") as file:
        words = file.readlines()
        words = [word.strip() for word in words]

    # สร้าง dictionary จาก list
    data = {"words": words}

    # เขียนข้อมูลลงในไฟล์ JSON
    with open("The_Oxford_3000.json", "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# makeWordToJson(getWord())
textToJson()