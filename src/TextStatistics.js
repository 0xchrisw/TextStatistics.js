/**
 * TextStatistics Class in Javascript
 *   @author:      Christopher Woodall
 *   @contact:     woodall.christopher@gmail.com
 *   @inspiration: https://github.com/FCC/Text-Statistics/
 *   @description: Calculates following readability scores
 *                  (formulae can be found in wiki):
 *                  - Flesch Kincaid Reading Ease
 *                  - Flesch Kincaid Grade Level
 *                  - Gunning Fog Score
 *                  - Coleman Liau Index
 *                  - SMOG Index
 *                  - Automated Reability Index

        Will also give:
          * String length
          * Letter count
          * Syllable count
          * Sentence count
          * Average words per sentence
          * Average syllables per word
        
        Sample Code
        ----------------
        console.log(TextStatistics.syllable_count('lion'));
        console.log(TextStatistics.all('<p>this is a test delicious</p><br />I hope THIS works!'));
    */

var TextStatistics = {
  /**
   * Returns all text statictics
   * @param   strText         Text to be checked
   */
  all: function( strText )
  {
    return {
	  text: { original: strText,
	          cleaned: this.clean_text(strText),
			  statistics: {
			    letter_count: this.letter_count(strText),
				//Syllable Count
				word_count: this.word_count(strText),
				sentence_count: this.sentence_count(strText),
				//Characters per Word
				average_syllables_per_word: this.average_syllables_per_word(strText),
				average_words_per_sentence: this.average_words_per_sentence(strText),
			  }
			},
	  flesch_kincaid_reading_ease: this.flesch_kincaid_reading_ease(strText),
	  flesch_kincaid_grade_level: this.flesch_kincaid_grade_level(strText),
	  gunning_fog_score: this.gunning_fog_score(strText),
	  coleman_liau_index: this.coleman_liau_index(strText),
	  smog_index: this.smog_index(strText),
	  automated_readability_index: this.automated_readability_index(strText),
	  average_grade_level: this.average_grade_level(strText),
	}
  },

  /**
   * Gives the Flesch-Kincaid Reading Ease of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  flesch_kincaid_reading_ease: function( strText )
  {
    strText = this.clean_text(strText);
    return (206.835 - (1.015 * this.average_words_per_sentence(strText)) - (84.6 * this.average_syllables_per_word(strText)));
  },

  /**
   * Gives the Flesch-Kincaid Grade level of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  flesch_kincaid_grade_level: function( strText )
  {
    strText = this.clean_text(strText);
    return ((0.39 * this.average_words_per_sentence(strText)) + (11.8 * this.average_syllables_per_word(strText)) - 15.59);
  },

  /**
   * Gives the Gunning-Fog score of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  gunning_fog_score: function( strText )
  {
    strText = this.clean_text(strText);
    return ((this.average_words_per_sentence(strText) + this.percentage_words_with_three_syllables(strText, false)) * 0.4);
  },

  /**
   * Gives the Coleman-Liau Index of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  coleman_liau_index: function( strText )
  {
    strText = this.clean_text(strText);
    return ( (5.89 * (this.letter_count(strText) / this.word_count(strText))) - (0.3 * (this.sentence_count(strText) / this.word_count(strText))) - 15.8 );
  },

  /**
   * Gives the SMOG Index of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  smog_index: function( strText )
  {
    strText = this.clean_text(strText);
    return 1.043 * Math.sqrt((this.words_with_three_syllables(strText) * (30 / this.sentence_count(strText))) + 3.1291);
  },

  /**
   * Gives the Automated Readability Index of text entered rounded to one digit
   * @param   strText         Text to be checked
   */
  automated_readability_index: function( strText )
  {
    strText = this.clean_text(strText);
    return ((4.71 * (this.letter_count(strText) / this.word_count(strText))) + (0.5 * (this.word_count(strText) / this.sentence_count(strText))) - 21.43);
  },

  /**
   * Returns the average of all test.
   * @param   strText      Text to be measured
   */
  average_grade_level: function( strText )
  {
    return (this.flesch_kincaid_grade_level(strText) + this.gunning_fog_score(strText) + this.coleman_liau_index(strText) + this.smog_index(strText) + this.automated_readability_index(strText))/5;
  },
  

}
