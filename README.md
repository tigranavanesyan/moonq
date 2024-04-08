# moonq

## Հարցաշար

- Անցեք հետևյալ [հղումով](https://forms.gle/jqmDa55LPqNGJveJ9)

## Առաջադրանք 1

1. Տիպերի և ինտերֆեյսերի սահմանում

   1. Ստեղծեք UserID տիպ, որը կարող է լինել string կամ number տեսկաի
   2. Ստեղծեք User Ինտերֆեյս, որը ներառում է հետևյալ դաշտերը․
      ```ts
      id: UserID
      name: string
      age: number
      email?: string (ոչ պարտադիր պարամետր)
      ```
   3. Ստեղծեք Admin Ինտերֆեյս, որը ընդլայնում է User ինտերֆեյսը ավելացնելով հետևյալ դաշտը․
      ```ts
      permissions: string[]
      ```

2. Ֆունկցիաներ

   1. Գրեք createUser Ֆունկցիա, որը որպես պարամետր ընդունում է name, age և email (ոչ պարտադիր պարամետր) և վերադարձնում է User տիպի օբյեկտ։

   2. Գրեք deleteUser Ֆունկցիա, որը որպես պարամետր ընդունում է User տեակաի օբյեկտ և վերադարձնում է void, բայց նախքան ջնջելը
      օգտատերը կոնսոլում մուտքագրում է իր անունը։

3. Աշխատեք զանգվածների և տիպերի հետ

   1. Ստեղծեք users զանգված, որը պարունակում է User տիպի օբյեկտներ.

   2. Գրեք Ֆունկցիա, որը ընդունում է users զանգված և տպում է բոլոր օգտատերերի անունները կոնսոլում.

4. Ջեներիկներ Generics

   1. Գրեք ընդհանրացված ֆունկցիա, որն ընդունում է երկու A և B պարամետր և վերադարձնում դրանց միությունը: Այս պարամետրերի տեսակների համար օգտագործեք Ջեներիկներ:

   2. Ստեղծեք getProperty ֆունկցիա, որը որպես պարամետր ընդունում է օբյեկտը և այդ օբյեկտի բանալին key և վերադարձնում համապատասխան բանալու արժեքը։ Արժեքի վերադարձի տեսակը նշելու համար օգտագործեք Ջեներիկներ:

_Հավելյալ առաջադրանքներ:_

- Օգտագործեք դեկորատորներ՝ արգումենտները մուտքագրելու և createUser և deleteUser ֆունկցիաների արժեքը վերադարձնելու համար:

### **Գնահատման չափանիշներ:**

- Յուրաքանչյուր առաջադրանքի կետի ճիշտ կատարում:
- Մաքուր և ընթեռնելի կոդ:
- Տվյալների մուտքագրման համար TypeScript-ի հնարավորությունների օգտագործում:
- Առաջադրանքը կատարելիս ուշադրություն դարձրեք խիստ տիպերի օգտագործմանը, հնարավորինս խուսափեք any օգտագործելուց։

## Առաջադրանք 2

#### Create a TypeScript program for a simple user registration system with the following requirements:

- Define an interface User with the following properties:

  ```
  id of type number
  username of type string
  email of type string
  password of type string
  ```

- Create a class UserRegistration with the following methods:

  1.  registerUser(user): This method should add a new user to a list of registered users. Argument user of type User and function return void.
  2.  getUserById(id): This method should return the user with the specified id or undefined if the user does not exist.
      Argument id of type number and function return type of User of undefined.
  3.  getUserByEmail(email) This method should return the user with the specified email or undefined if the user does not exist.
      Argument email of type string and function return type of User of undefined.
