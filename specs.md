**Description**
Dino is a language that does whatever I want it to do. 

Scope is a value
a = {}

Scope is a blackbox
a = 1;

{
    // a does not exist yet

    a = 5;
    b = 6;

    a == 5
}

a == 1

Scope is a memory
a = 7;
b.a = a;
b = {
    c = 5;
    d = 6;
}

b.a == 7
a.c == 5
a.d == 6

Scope is an execution environment
a = {
    b = 5 + 5;
}

a.b == 10