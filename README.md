
# CookieStorage (Working)

Use cookie as object storage.

## Features

- Save object data to cookie as escaped JSON String
- Fetch object data from cookie as object
- Have interface available as instance
- No dependencies (You may need to import json2.js to polyfill JSON API)


## Usage

### Initialize instance

```javascript
var myStorage = new CookieStorage("my-storage", {
    lifetime: 60 * 60 * 24,
    path: "/"
});
```

The data of this storage will saved as cookie like 'my-storage=[JSON String]'

### Set/Get data

```javascript
// setter
myStorage.set({
    name: "John",
    email: "john@example.com",
    age: 23
});

// getter
myStorage.get("name"); // "John"
```

### Fetch/Save data

```javascript
myStorage.fetch(); // fetch data from cookie
myStorage.save(); // save data to cookie
```

### No Conflict

Use noConflict() to avoid confliction, if needed.

```
var MyCookieStorage = CookieStorage.noConflict();
```

## Interfaces

- **config(key:String, value:\*):\***  
  Set or get options
- **fetch():CookieStorage**  
  Fetch data from cookie
- **set(key:String, value:\*):CookieStorage**,  
  **set(data:Object):CookieStorage**  
  Set data
- **get(key:String):\***,  
  **get():Object**  
  Get data
- **save():CookieStorage**  
  Save the data to cookie
- **remove(key:String):CookieStorage**  
  Remove value from data by key
- **clear(save:Boolean):CookieStorage**  
  Clear data, save it to cookie if `save` is TRUE


## Author

mach3 @ <http://github.com/mach3>
