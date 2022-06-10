# TODO:

class vowel():
    def __init__(self, str):
        self.string = str
    def findVowel( self, string):
        array = ['a','i','o','e','u']
        a = ""
        string = string.lower()
        for i in string:
            if(i in array):
                a += i
        return a
    def sumOfNaturealNumber(self, n):
        number = 0
        for i in range(n+1):
            number += i
        return number
    def nonVowelString(self, string):
        array = ['a','i','o','e','u']
        a = ""
        string = string.lower()
        for i in string:
            if(i not in array):
                a += i
        print(a)
        return False 
    def patter(self, n):
        for i in range(n+1):
            print(" "*(n-i), "*"*i)
        return True 
    def patter2(self, m):
        #TODO: we have to create patter like below
        # 1
        # 2 3
        # 4 5 6
        # 7 8 9 10
        # 11 12 13 14 15
        for i in range(m+1):
            print(i,i+1)


d = vowel("me")
d.findVowel("abcdEIGE")
c=d.sumOfNaturealNumber(5)
e = d.patter2(5)
