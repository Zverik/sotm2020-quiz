var app = new Vue({
  el: '#app',

  data: {
    stage: 'intro',
    qid: -1,
    question: null,
    answer: 0,
    correct_answers: 0
  },

  computed: {
    correct: function() {
      return this.question.correct.indexOf(this.answer) >= 0;
    },

    percent_answered: function() {
      if (!this.question.stats)
        return null;
      return Math.round(100.0 * this.question.stats[this.answer-1] / this.question.stats.reduce((a, c) => a + c));
    },

    correct_answer: function() {
      return this.question.correct.map(i => this.question.answers[i-1]).join(' or ');
    }
  },

  created: function() {
    this.quiz = quiz;
  },

  methods: {
    startQuiz: function() {
      this.stage = 'quiz';
      this.nextQuestion()
    },

    stopQuiz: function() {
      this.stage = 'results'
    },

    nextQuestion: function() {
      if (this.question && this.correct)
        this.correct_answers += 1;
      this.answer = 0;
      this.qid += 1;
      if (this.qid >= this.quiz.questions.length)
        this.stopQuiz()
      else {
        this.question = this.quiz.questions[this.qid];
      }
    },

    buttonStyle: function(i) {
      if (!this.answer)
        return 'outline-secondary';
      return this.question.correct.indexOf(i+1) >= 0 ? 'success' : 'danger';
    },

    getRank: function() {
      let ranks = this.quiz.ranks,
        percent = 100.0 * this.correct_answers / this.quiz.questions.length,
        rankSplit = [
          [90],
          [50, 90],
          [40, 80, 95],
          [30, 60, 80, 95],
          [30, 50, 70, 85, 95],
          [25, 45, 60, 75, 90, 100]
        ];
      if (!ranks)
        return 'Somebody';
      if (ranks.length == 1)
        return ranks[0];
      if (ranks.length > rankSplit.length + 1)
        ranks.slice(ranks.length - rankSplit.length - 1);
      let rankTable = rankSplit[ranks.length - 2];
      for (let i = 0; i < rankTable.length; i++) {
        if (percent < rankTable[i])
          return ranks[i];
      }
      return ranks[ranks.length - 1];
    },

    br: function(s) {
      if (s.indexOf('</') > 0)
        return s.replaceAll('\n', '<br>');
      return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;').replaceAll('\n', '<br>');
    }
  }
});
