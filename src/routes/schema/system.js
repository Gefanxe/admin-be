const systemLogin = {
  schema: {
    tags: ["system"],
    description: "登入",
    summary: "...",
    body: {
      type: "object",
      required: ["captcha", "ip", "password", "username"],
      properties: {
        username: {
          type: "string",
          description: "用戶帳號",
          errorMessage: {
            type: '必須是字串'
          }
        },
        password: {
          type: "string",
          description: "用戶密碼",
          errorMessage: {
            type: '必須是字串'
          }
        },
        ip: {
          type: "string",
          pattern: "\\d+\\.\\d+\\.\\d+\\.\\d+",
          description: "用戶來源IP",
          errorMessage: {
            type: '必須是字串',
            pattern: '不符合IPv4格式'
          }
        },
        captcha: {
          type: "string", 
          pattern: "^.{4}$",
          description: "驗證碼",
          errorMessage: {
            type: '必須是字串',
            pattern: '請輸入4個字元'
          }
        },
      },
      errorMessage: {
        required: {
          ip: '缺少IP',
          captcha: '缺少驗證碼',
          username: '缺少username',
          password: '缺少password',
        }
      }
    },
    response: {
      "2xx": {
        type: "object",
        properties: {
          code: {
            type: "number",
            description:
              "錯誤代碼,20000:正常",
          },
          data: {
            type: "object",
            properties: {
              token: { type: "string", description: "登入成功token" },
            },
          },
          message: { type: "string", description: "說明訊息" },
        },
      },
      "422": {
        type: "object",
        properties: {
          code: {
            type: "number",
            description:
              "錯誤代碼",
          },
          data: {
            type: "object"
          },
          message: { type: "string", description: "說明訊息" },
        }
      }
    },
  },
};

const schemaUserLogout = {
  schema: {
    tags: ["用戶相關"],
    description: "登出",
    summary: "...",
    response: {
      "2xx": {
        type: "object",
        properties: {
          code: { type: "number", description: "錯誤代碼,0:正常,-1:失敗" },
          message: { type: "string", description: "說明訊息" },
          result: { type: "boolean", description: "執行結果" },
        },
      },
    },
  },
};

const schemaUserStatus = {
  schema: {
    tags: ["用戶相關"],
    description: "取用戶目前的登入狀態用戶",
    summary: "...",
    security: [
      {
        Bearer: [],
      },
    ],
    response: {
      "2xx": {
        type: "object",
        properties: {
          result: { type: "boolean", description: "執行結果" },
          avatar: { type: "string", description: "用戶頭像(登入失敗回傳空值)" },
          email: { type: "string", description: "個人資料" },
          profile: {
            type: "object",
            properties: {
              realName: {
                type: "string",
                description: "用戶真實姓名(登入失敗回傳空值)",
              },
            },
          },
          uId: {
            type: "number",
            description:
              "用戶uid,-1:用戶名稱(或email)錯誤,-2:錯誤密碼,-3:安全提問錯誤,-4:以上錯誤累計超過論壇設定值",
          },
          userName: { type: "string", description: "用戶名稱" },
        },
      },
      500: {
        type: "object",
        properties: {
          result: { type: "boolean", description: "執行結果" },
          status: { type: "number", description: "status code: 500" },
          message: { type: "string", description: "錯誤訊息" },
        },
      },
    },
  },
};

const schemaGetUserData = {
  schema: {
    tags: ["用戶相關"],
    description: "取動態牆用戶資料",
    summary: "...",
    security: [
      {
        Bearer: [],
      },
    ],
    params: {
      type: "object",
      properties: {
        uid: {
          type: "string",
          description: "uid",
        },
      },
    },
    response: {
      "2xx": {
        type: "object",
        properties: {
          authorAvatar: { type: "string", description: "用戶頭像" },
          feeds: { type: "number", description: "相關貼文總數" },
          groupId: { type: "number", description: "用戶組id" },
          groupName: { type: "string", description: "用戶組名稱" },
          profile: {
            type: "object",
            properties: {
              info: { type: "string", description: "個人資料" },
              realName: { type: "string", description: "用戶名稱" },
              fb: { type: "string", description: "facebook連結" },
              ig: { type: "string", description: "Instagram連結" },
            },
          },
          uId: { type: "number", description: "用戶id" },
          userName: { type: "string", description: "用戶帳號" },
          voteInfo: {
            type: ["object", "null"],
            properties: {
              link: { type: "string", description: "投票頁連結" },
              num: { type: "string", description: "票數" },
              rank: { type: "string", description: "投票排名" },
            },
          },
        },
      },
    },
  },
};

const schemaSetUserData = {
  schema: {
    tags: ["用戶相關"],
    description: "動態牆用戶資料更新",
    summary: "...",
    security: [
      {
        Bearer: [],
      },
    ],
    body: {
      type: "object",
      required: [],
      properties: {
        uid: { type: "string", description: "用戶id" },
        realName: { type: "string", description: "用戶真實姓名" },
        info: { type: "string", description: "個人資料" },
        fb: { type: "string", description: "facebook連結" },
        ig: { type: "string", description: "Instagram連結" },
      },
    },
    response: {
      "2xx": {
        type: "object",
        properties: {
          result: { type: "boolean", description: "執行結果" },
          status: { type: "number", description: "status code: 500" },
          message: { type: "string", description: "錯誤訊息" },
          member: {
            type: "object",
            properties: {
              profile: {
                type: "object",
                properties: {
                  info: { type: "string", description: "個人資料" },
                  realName: { type: "string", description: "用戶名稱" },
                  fb: { type: "string", description: "facebook連結" },
                  ig: { type: "string", description: "Instagram連結" },
                },
              },
              uId: { type: "number", description: "用戶id" },
            },
          },
        },
      },
      500: {
        type: "object",
        properties: {
          result: { type: "boolean", description: "執行結果" },
          status: { type: "number", description: "status code: 500" },
          message: { type: "string", description: "錯誤訊息" },
        },
      },
    },
  },
};

const schemaUserPosts = {
  schema: {
    tags: ["用戶相關"],
    description: "取動態牆用戶相關貼文",
    summary: "...",
    security: [
      {
        Bearer: [],
      },
    ],
    querystring: {
      type: "object",
      properties: {
        lastpost: {
          type: "string",
          description: "lastpost",
        },
      },
    },
    params: {
      type: "object",
      properties: {
        uid: {
          type: "string",
          description: "uid",
        },
      },
    },
    response: {
      "2xx": {
        type: "array",
        items: {
          type: "object",
          properties: {
            attachment: {
              type: "object",
              properties: {
                fileType: {
                  type: "number",
                  description: "附件類型, 1=照片, 2=YT影片連結",
                },
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      dateline: { type: "number", description: "建立時間" },
                      fileType: {
                        type: "number",
                        description: "附件類型, 1=照片, 2=YT影片連結",
                      },
                      id: { type: "number", description: "照片id" },
                      pid: { type: "number", description: "貼文id" },
                      resPath: {
                        type: "string",
                        description: "附件內容, 照片路徑 or YT影片連結",
                      },
                    },
                  },
                },
              },
            },
            author: { type: "string", description: "用戶名稱" },
            authorAvatar: { type: "string", description: "用戶頭像" },
            authorid: { type: "number", description: "用戶id" },
            commentCount: { type: "number", description: "留言總數" },
            comments: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  comment: { type: "string", description: "用戶留言內容" },
                  dateline: { type: "number", description: "留言時間" },
                  uid: { type: "number", description: "留言用戶id" },
                  username: { type: "string", description: "留言用戶名稱" },
                  avatar: { type: "string", description: "留言用戶頭像" },
                },
              },
            },
            coverImg: { type: "string", description: "貼文封面圖" },
            fid: { type: "number", description: "論壇版塊id" },
            isLike: {
              type: "number",
              description: "用戶是否有點讚(1:是/0:否)",
            },
            isShare: {
              type: "number",
              description: "用戶是否有分享(1:是/0:否)",
            },
            lastpost: { type: "number", description: "貼文最發表時間" },
            likeCount: { type: "number", description: "貼文點讚總數" },
            message: { type: "string", description: "貼文內容" },
            postType: {
              type: "string",
              description: "PO文來源,t=論壇貼文, p=動態牆貼文",
            },
            shareCount: { type: "number", description: "貼文分享讚總數" },
            subject: { type: "string", description: "貼文標題" },
            tagList: {
              type: "array",
              items: { type: "string", description: "標籤名稱" },
            },
            tags: { type: "string", description: "所有標籤字串" },
            threadUrl: { type: "string", description: "論壇貼文連結" },
            tid: { type: "number", description: "論壇貼文id" },
          },
        },
      },
    },
  },
};

const schemaNewPosts = {
  schema: {
    tags: ["用戶相關"],
    description: "取動態牆最新動態",
    summary: "...",
    security: [
      {
        Bearer: [],
      },
    ],
    querystring: {
      type: "object",
      properties: {
        lastpost: {
          type: "string",
          description: "lastpost",
        },
      },
    },
    response: {
      "2xx": {
        type: "array",
        properties: {
          attachment: {
            type: "object",
            properties: {
              fileType: {
                type: "number",
                description: "附件類型, 1=照片, 2=YT影片連結",
              },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    dateline: { type: "number", description: "建立時間" },
                    fileType: {
                      type: "number",
                      description: "附件類型, 1=照片, 2=YT影片連結",
                    },
                    id: { type: "number", description: "照片id" },
                    pid: { type: "number", description: "貼文id" },
                    resPath: {
                      type: "string",
                      description: "附件內容, 照片路徑 or YT影片連結",
                    },
                  },
                },
              },
            },
          },
          author: { type: "string", description: "用戶名稱" },
          authorAvatar: { type: "string", description: "用戶頭像" },
          authorid: { type: "number", description: "用戶id" },
          commentCount: { type: "number", description: "留言總數" },
          comments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                comment: { type: "string", description: "用戶留言內容" },
                dateline: { type: "number", description: "留言時間" },
                uid: { type: "number", description: "留言用戶id" },
                username: { type: "string", description: "留言用戶名稱" },
                avatar: { type: "string", description: "留言用戶頭像" },
              },
            },
          },
          coverImg: { type: "string", description: "貼文封面圖" },
          fid: { type: "number", description: "論壇版塊id" },
          isLike: { type: "number", description: "用戶是否有點讚(1:是/0:否)" },
          isShare: { type: "number", description: "用戶是否有分享(1:是/0:否)" },
          lastpost: { type: "number", description: "貼文最發表時間" },
          likeCount: { type: "number", description: "貼文點讚總數" },
          message: { type: "string", description: "貼文內容" },
          postType: {
            type: "string",
            description: "PO文來源,t=論壇貼文, p=動態牆貼文",
          },
          shareCount: { type: "number", description: "貼文分享讚總數" },
          subject: { type: "string", description: "貼文標題" },
          tagList: {
            type: "array",
            items: { type: "string", description: "標籤名稱" },
          },
          tags: { type: "string", description: "所有標籤字串" },
          threadUrl: { type: "string", description: "論壇貼文連結" },
          tid: { type: "number", description: "論壇貼文id" },
        },
      },
    },
  },
};

const schemaUserList = {
  schema: {
    tags: ["用戶相關"],
    description: "取網紅列表 標籤",
    summary: "...",
    security: [
      {
        Bearer: [],
      },
    ],
    response: {
      "2xx": {
        type: "array",
        items: {
          type: "object",
          properties: {
            tagId: { type: "number", description: "標籤ID" },
            tagName: { type: "string", description: "標籤名稱" },
            member: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  uid: { type: "number", description: "用戶ID" },
                  realName: { type: "string", description: "用戶名稱" },
                  avatar: { type: "string", description: "用戶頭貼" },
                },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = {
  systemLogin,
};
