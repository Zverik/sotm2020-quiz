#!/usr/bin/env python3
import json
import sys
import csv

if len(sys.argv) <= 1:
    print('Convert myQuiz.org csv export to a json for this quiz system.')
    print('Usage: {} <QuizReport.csv> [<quiz_data.js>]'.format(sys.argv[0]))
    sys.exit(1)

questions = []
with open(sys.argv[1], 'r') as f:
    columns = {}
    quest_cols = {}
    answers = {}
    for rowid, row in enumerate(csv.reader(f)):
        if rowid == 0:
            # First row maps columns to questions.
            last_question = -1
            for cid, column in enumerate(row):
                if column.startswith('Question '):
                    qnum = int(column[9:])  # "Question 24" -> 24
                    quest_cols[cid] = qnum - 1
                    if qnum != last_question:
                        answer = 1
                        last_question = qnum
                    else:
                        answer += 1
                    answers[cid] = answer

        elif rowid == 1:
            # Second row lists questions.
            for k, v in sorted(list(quest_cols.items())):
                if v < len(questions):
                    continue
                if v > len(questions):
                    raise IndexError(f'Question {v+1} follows a gap in numbering')
                questions.append({
                    'text': row[k].strip(),
                    'answers': [],
                    'correct': set(),
                    'stats': []
                })

        elif rowid == 2:
            # Third row enumerates answers for each question.
            # We don't need these numbers.
            pass

        elif rowid == 3:
            # Fourth row has titles for system columns and answers to each question.
            for cid, column in enumerate(row):
                if cid not in quest_cols:
                    columns[column] = cid
                else:
                    questions[quest_cols[cid]]['answers'].append(column.strip())
                    questions[quest_cols[cid]]['stats'].append(0)

        elif row[0]:
            # Last row doesn't have player name and lists answers count
            # which can be devised from values above.
            # Here we count number of responses and which answers are correct.
            for cid, qid in quest_cols.items():
                if row[cid]:
                    if row[cid] == '1':
                        questions[qid]['correct'].add(answers[cid])
                    questions[qid]['stats'][answers[cid] - 1] += 1

for q in questions:
    q['correct'] = sorted(q['correct'])
outfile = sys.stdout if len(sys.argv) <= 2 else open(sys.argv[2], 'w')
outfile.write('quiz = ')
json.dump({'title': 'Quiz', 'questions': questions}, outfile, ensure_ascii=False, indent=2)
