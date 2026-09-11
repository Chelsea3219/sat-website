import uuid
import pprint
import json

with open("/Users/chelseazebaze/Desktop/sat-website/backend/app/domains/questions/samples/sample_answer_sheet.json", "r") as file:
  sample_answer_sheet = json.load(file)

with open("/Users/chelseazebaze/Desktop/sat-website/backend/app/domains/questions/samples/question_ids.json", "r") as file:
  question_ids = json.load(file)

"""for answer in sample_answer_sheet:
  answer["clerk_id"] = "user_3J4JCHKe6SMVVhxy9ClQOX10f6a"""

for i in range(len(sample_answer_sheet)):
  sample_answer_sheet[i]["clerk_id"] = "user_3J4JCHKe6SMVVhxy9ClQOX10f6a"
  sample_answer_sheet[i]["question_id"] = question_ids[i]["question_id"]

with open("sample_answer_sheet2.json", "w") as file:
  json.dump(sample_answer_sheet, file, indent=2)


pprint.pprint(sample_answer_sheet)
print("---------------------------------------------")
