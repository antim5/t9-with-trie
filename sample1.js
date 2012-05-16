// T9 Prototype Application
// Author: Andrey Timofeyev aatimfoeyev (at) gmail (dot) com
//
// Original Trie implementation by Dennis Byrne
// http://notdennisbyrne.blogspot.com/2008/12/javascript-trie-implementation.html

// uses sample1Feed = [];

app = {};
app.stem = [];
app.stemWord = '';
app.stemLastNode = null;
app.wStage = '';

app.init = function () {
	app.trie = new sample1.TrieNode(/* root */);
	for (i = 0; i < sample1Feed.length; i++) {
		app.trie.add(sample1Feed[i], sample1Feed[i], 0, null);
	}
	app.trie.normalizeNode();
};

app.click = function(evt) {
	if (window.event) { evt = event; }
	if (evt.keyCode >= 50 && evt.keyCode <= 57) {
		// digit button
		var k = evt.keyCode - 48;
		app.stem.push(k);
		if (app.stemLastNode == null) { app.stemLastNode = app.trie; }
		if (app.stemLastNode.children[k]) {
			app.stemWord = app.stemLastNode.children[k].words[0];
			app.stemLastNode = app.stemLastNode.children[k];
		}
		else {
			if (app.stemWord.substr(-1) != '?') { app.stemWord += '?'; }
		}

	}
	else if (evt.keyCode == 37) {
		// backspace
		var rightOffset;
		app.stem.pop();
		if (app.stemWord.substr(-1) == '?') { rightOffset = 2; } else { rightOffset = 1; }
		app.stemWord = app.stemWord.substr(0, app.stemWord.length - rightOffset);
		app.stemLastNode = app.stemLastNode.parent;
	}
	else if (evt.keyCode == 32) {
		// new word
		app.wStage += app.stemWord + ' ';
		app.stemLastNode = null; app.stemWord = '';
	}
	else if (evt.keyCode == 38) {
		// hits cycle
		if (app.stemLastNode.words[(app.stemLastNode.wordIdx + 1)]) { app.stemLastNode.wordIdx += 1; } else { app.stemLastNode.wordIdx = 0; }
		app.stemWord = app.stemLastNode.words[(app.stemLastNode.wordIdx)];
	}

	app.refreshStage();
};

app.refreshStage = function() {
	var wStr = app.wStage + '<u>' + app.stemWord + '</u>';
	document.getElementById('wStage').innerHTML = wStr;
};

sample1 = {};

sample1.TrieNode = function() {
	this.wordCount = 0;
	this.prefixCount = 0;
	this.children = [];
	this.words = [];
	this.wordIdx = 0;
	this.parent = null;
};

sample1.TrieNode.prototype.normalizeNode = function() {
	if (this.words.length > 0) {
		this.words = this.words.unique(); this.words = this.words.sort();
	}
	for (var i in this.children) {
		if (!isNaN(i)) { this.children[i].normalizeNode(); }
	}
}

sample1.TrieNode.prototype.add = function(word, fullWord, level, parentNode) {
	if (word) {
		this.parent = parentNode; this.prefixCount++;
		var k = sample1._keyMap[word.charAt(0)], matchFragment = fullWord.substring(0, level);
		this.words.push(matchFragment);
		(this.children[k] || (this.children[k] = new sample1.TrieNode()))
			.add(word.substring(1), fullWord, (level + 1), this);
	}
	else { this.wordCount++; }
};

// data
sample1._keyMap = {
	'a': 2, 'b': 2, 'c': 2, 'd': 3, 'e': 3, 'f': 3, 'g': 4, 'h': 4,
	'i': 4, 'j': 5, 'k': 5, 'l': 5, 'm': 6, 'n': 6, 'o': 6, 'p': 7,
	'q': 7, 'r': 7, 's': 7, 't': 8, 'u': 8, 'v': 8, 'w': 9, 'x': 9,
	'y': 9, 'z': 9
};

// utility methods
Array.prototype.unique =
  function() {
    var a = [];
    var l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If this[i] is found later in the array
        if (this[i] === this[j])
          j = ++i;
      }
      a.push(this[i]);
    }
    return a;
  };