# blogging-api
This is an api for a blogging application

---

## Requirements
1. User should be able to register 
2. User should be able to login with Passport using JWT
3. Implement basic auth
4. Logged in and not logged in users should be able to get a list of all published blogs
5. Logged in and not logged in users should be able to get a specific blog
6. Logged in users should be able to get all blogs they've created
7. Logged in users should be able to create a blog
8. Logged in users should be able to update a blog
9. Logged in users should be able to delete a blog
10. Test application
---
## Setup
- Install NodeJS, mongodb
- pull this repo
- update env with example.env

---
## Base URL
- https://blogging-api-xdx0.onrender.com


## Models
---

### User
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  firstName | string  |  required |
|  lastName  |  string |  required  |
|  email     | string  |  required, unique |
|  password |   string |  required  |


### Blog
| field  |  data_type | constraints  |
|---|---|---|
|  id |  string |  required |
|  title | string  |  required, unique|
|  description  |  string |  optional  |
|  author     | ObjectId  |  optional |
|  state |   string |  enum: ['draft', 'published'], default: 'draft'  |
|  read_count |  number |  optional, default: 0 |
|  reading_time |  number |  optional |
|  tags |  array |  optional |
|  timestamp |  Date |  optional, default: current time |



## APIs
---

### Signup User

- Route: /api/v1/users/signup
- Method: POST
- Body: 
```
{
  "firstName": "jon",
  "lastName": "doe",
  "email": "doe@example.com",
  "password": "Password1"
}
```

- Responses

Success
```
{
    "message": "User successfully created",
    "data": {
      "user": {
        "firstName": "jon",
        "lastName": "doe",        
        "email": "doe@example.com",
        "_id": "98ew6806c293kdf4b48dlkj2",
        "createdAt": "2022-11-10T21:07:18.222Z",
        "updatedAt": "2022-11-10T21:07:18.222Z"
      }
    ,
    "token": "dlfjdfldjfdlfjdfjfdljaoeiroeure..."
}
```
---
### Login User

- Route: /login
- Method: POST
- Body: 
```
{
  "password": "Password1",
  "email": 'doe@example.com",
}
```

- Responses

Success
```
{
  "message": "User successfully signed in",
  "data": {
    "user": {
      "_id": "98ew6806c293kdf4b48dlkj2",
      "firstName": "Jon",
      "lastName": "Doe",
      "email": "doe@example.com",
      "createdAt": "2022-11-06T14:08:47.939Z",
      "updatedAt": "2022-11-06T14:08:47.939Z",
    }
  },
  "token": "dlfjdfldjfdlfjdfjfdljaoeiroeure..."
}
```

---
### Create Blog

- Route: /api/v1/blogs/
- Method: POST
- Header
    - Authorization: Bearer {token}
- Body: 
```
{
  "title": "The first blog post",
  "description": "Blog post description",
  "tags": ["test", "blog"],
  "body": "This is the body of the first blog post."
}
```

- Responses

Success
```
{
  "message": "Blog post successfully created",
  "data": {
    "blog": {
      "title": "The first blog post",
      "description": "Blog post description",
      "author": "98ew6806c293kdf4b48dlkj2",
      "state": "draft",
      "read_count": 0,
      "reading_time": 0.1,
      "tags": [
        "test",
        "blog"
      ],
      "body": "This is the body of the first blog post.",
      "timestamp": "2022-11-10T21:04:02.173Z",
      "_id": "9827k2f15f17edljdh927d36",
      "createdAt": "2022-11-10T21:32:33.122Z",
      "updatedAt": "2022-11-10T21:32:33.122Z",
    }
  }
}
```
---
### Update Blog

- Route: /api/v1/blogs/:id
- Method: UPDATE
- Header
    - Authorization: Bearer {token}
    
Note: 
  * the author, read_count, and reading_time fields cannot be manually updated.
  * id is the ObjectId("...")

- Body
```
{
    state: "published",
    title: "The first blog post - edited",
    "body": "This is the body of the first blog post. This is the body of the first blog post. This is the body of the first blog post. This is the body of the first blog post."
}
```

- Responses

Success
```
{
  "message": "Blog post successfully updated",
  "data": {
    "updatedBlog": {
      "_id": "9827k2f15f17edljdh927d36",
      title: "The first blog post - edited",
      "description": "Blog post description",
      "author": "98ew6806c293kdf4b48dlkj2",
      "state": "published",
      "read_count": 0,
      "reading_time": 0.2,
      "tags": [
        "test",
        "blog"
      ],
      "body": "This is the body of the first blog post. This is the body of the first blog post. This is the body of the first blog post. This is the body of the first blog post.",      "timestamp": "2022-11-10T21:04:02.173Z",
      "createdAt": "2022-11-10T21:32:33.122Z",
      "updatedAt": "2022-11-10T21:42:00.854Z",
      "__v": 0
    }
  }
}
```
---
### Delete Blog

- Route: /api/v1/blogs/:id
- Method: DELETE
- Header
    - Authorization: Bearer {token}
- Responses

Note id is the ObjectId("...")

Success
```
{
  "message": "Blog post successfully deleted",
  "data": {}
}
```
---

### Get All Blogs

- Route: /api/v1/blogs/
- Method: GET
- Query params: 
    - page (default: 1)
    - pageLimit (default: 20)
    - author
    - title
    - tags (space separated values (one or many), e.g test blogs)
    - sortBy (options: read_count | reading_time | timestamp)
    - sortOrder (options: asc | desc, default: asc)
- Responses

Success
```
{
  "message": "All published blogs",
  "data": {
    "blogs": [
      {
        "_id": "9827k2f15f17edljdh927d36",
        "title": "This is the first blog post",
        "description": "Blog post description - edited",
        "author": "98ew6806c293kdf4b48dlkj2",
        "state": "published",
        "read_count": 0,
        "reading_time": 0.1,
        "tags": [
          "test",
          "blog"
        ],
        "body": "This is the body of the first blog post. This is the body of the first blog post. This is the body of the first blog post. This is the body of the first blog post.",
        "createdAt": "2022-11-06T17:17:14.689Z",
        "updatedAt": "2022-11-06T20:08:07.895Z"
      }
      ...
    ]
  }
}
```
---

### Get a Blog by id

- Route: /api/v1/blogs/blog/:id
- Method: GET
- Responses

- Note id is the ObjectId("...")

Success
```
{
  "message": "Blog found",
  "data": {
    "blog": {
        "_id": "9827k2f15f17edljdh927d36",
        "title": "This is the first blog post",
        "description": "Blog post description - edited",
        "author": "98ew6806c293kdf4b48dlkj2",
        "state": "published",
        "read_count": 0,
        "reading_time": 0.1,
        "tags": [
          "test",
          "blog"
        ],
        "body": "This is the body of the first blog post. This is the body of the first blog post. This is the body of the first blog post. This is the body of the first blog post.",
        "createdAt": "2022-11-06T17:17:14.689Z",
        "updatedAt": "2022-11-06T20:08:07.895Z"
      },
    "author": {
      "_id": "98ew6806c293kdf4b48dlkj2",
      "firstName": "Jon",
      "lastName": "Doe",
      "email": "doe@gmail.com",
      "createdAt": "2022-11-06T14:08:47.939Z",
      "updatedAt": "2022-11-06T14:08:47.939Z"
    }
  }
}
```

---
### Get My Blogs (logged in user)

- Route: /api/v1/blogs/myblogs/
- Method: GET
- Header
    - Authorization: Bearer {token}
- Query params: 
    - page (default: 1)
    - pageLimit (default: 20)
    - state (options: draft | published)
- Responses

Success
```
{
  "message": "My blogs",
  "data": {
    "blogs": [
      {
        "_id": "9827k2f15f17edljdh927d36",
        "title": "This is the first blog post",
        "description": "Blog post description - edited",
        "author": "98ew6806c293kdf4b48dlkj2",
        "state": "published",
        "read_count": 0,
        "reading_time": 0.1,
        "tags": [
          "test",
          "blog"
        ],
        "body": "This is the body of the first blog post. This is the body of the first blog post. This is the body of the first blog post. This is the body of the first blog post.",
        "createdAt": "2022-11-06T17:17:14.689Z",
        "updatedAt": "2022-11-06T20:08:07.895Z"
      },
      ...
    ]
  }
}
```
---
...

## Contributor
- Mohammed Akanji
