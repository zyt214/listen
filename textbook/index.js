// ===================== 1. 填写你的数据 =====================
const bookData = {
    bookInfo: {
        bookName: '义务教育教科书·九年级英语',
        approval: '教育部2014年审订',
        press: '人民教育出版社',
        order: 13,
        vocabularyRule: '九年级全一册英语词汇'
    },
    unitVocabulary: {
        'Unit1 How can we become good learners?': [
            {
                word: 'textbook',
                phonetic: '/tekstbʊk/',
                meaning: '教科书；课本',
                page: 1,
                requirement: 'listen_speak_read'
            },
            {
                word: 'conversation',
                phonetic: '/ˌkɒnvəˈseɪʃn/, /ˌkɑːnvərˈseɪʃn/',
                meaning: '交谈；谈话',
                page: 2,
                requirement: 'listen_speak_read'
            },
            {
                word: 'aloud',
                phonetic: '/əˈlaʊd/',
                meaning: '大声地；出声地',
                page: 2,
                requirement: 'listen_speak_read'
            },
            {
                word: 'pronunciation',
                phonetic: '/prəˌnʌnsiˈeɪʃn/',
                meaning: '发音；读音',
                page: 2,
                requirement: 'listen_speak_read'
            },
            {
                word: 'sentence',
                phonetic: '/ˈsentəns/',
                meaning: '句子',
                page: 2,
                requirement: 'listen_speak_read'
            },
            {
                word: 'patient',
                phonetic: '/ˈpeɪʃnt/',
                meaning: '有耐心的；病人',
                page: 2,
                requirement: 'listen_speak_read'
            },
            {
                word: 'expression',
                phonetic: '/ɪkˈspreʃn/',
                meaning: '表情；表示；表达方式',
                page: 3,
                requirement: 'listen_speak_read'
            },
            {
                word: 'discover',
                phonetic: '/dɪˈskʌvə(r)/',
                meaning: '发现；发觉',
                page: 3,
                requirement: 'listen_speak_read'
            },
            {
                word: 'secret',
                phonetic: '/ˈsiːkrət/',
                meaning: '秘密；秘诀；秘密的；保密的',
                page: 3,
                requirement: 'listen_speak_read'
            },
            {
                word: 'look up',
                phonetic: '/lʊk ʌp/',
                meaning: '(在词典、参考书中或通过电脑)查阅；抬头看',
                page: 3,
                requirement: 'listen_speak_read'
            },
            {
                word: 'grammar',
                phonetic: '/ˈgræmə(r)/',
                meaning: '语法',
                page: 3,
                requirement: 'listen_speak_read'
            },
            {
                word: 'repeat',
                phonetic: '/rɪˈpiːt/',
                meaning: '重复；重做',
                page: 4,
                requirement: 'listen_speak_read'
            },
            {
                word: 'note',
                phonetic: '/nəʊt/',
                meaning: '笔记；记录；注意；指出',
                page: 4,
                requirement: 'listen_speak_read'
            },
            {
                word: 'pal',
                phonetic: '/pæl/',
                meaning: '朋友；伙伴',
                page: 4,
                requirement: 'listen_speak_read'
            },
            {
                word: 'physics',
                phonetic: '/ˈfɪzɪks/',
                meaning: '物理；物理学',
                page: 4,
                requirement: 'listen_speak_read'
            },
            {
                word: 'chemistry',
                phonetic: '/ˈkemɪstri/',
                meaning: '化学',
                page: 4,
                requirement: 'listen_speak_read'
            },
            {
                word: 'memorize',
                phonetic: '/ˈmeməraɪz/',
                meaning: '记忆；记住',
                page: 4,
                requirement: 'listen_speak_read'
            },
            {
                word: 'pattern',
                phonetic: '/ˈpætn/, /ˈpætərn/',
                meaning: '模式；方式',
                page: 4,
                requirement: 'listen_speak_read'
            },
            {
                word: 'pronounce',
                phonetic: '/prəˈnaʊns/',
                meaning: '发音',
                page: 5,
                requirement: 'listen_speak_read'
            },
            {
                word: 'increase',
                phonetic: '/ɪnˈkriːs/',
                meaning: '增加；增长',
                page: 5,
                requirement: 'listen_speak_read'
            },
            {
                word: 'speed',
                phonetic: '/spiːd/',
                meaning: '速度',
                page: 5,
                requirement: 'listen_speak_read'
            },
            {
                word: 'partner',
                phonetic: '/ˈpɑː(r)tnə(r)/',
                meaning: '搭档；同伴',
                page: 5,
                requirement: 'listen_speak_read'
            },
            {
                word: 'born',
                phonetic: '/bɔː(r)n/',
                meaning: '出生；天生的',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'be born with',
                phonetic: '/bi bɔːn wɪð/',
                meaning: '天生具有',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'ability',
                phonetic: '/əˈbɪləti/',
                meaning: '能力；才能',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'create',
                phonetic: '/kriˈeɪt/',
                meaning: '创造；创建',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'brain',
                phonetic: '/breɪn/',
                meaning: '大脑',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'active',
                phonetic: '/ˈæktɪv/',
                meaning: '活跃的；积极的',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'attention',
                phonetic: '/əˈtenʃn/',
                meaning: '注意；关注',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'pay attention to',
                phonetic: '/peɪ əˈtenʃn tuː/',
                meaning: '注意；关注',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'connect',
                phonetic: '/kəˈnekt/',
                meaning: '(使)连接；与……有联系',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'connect … with',
                phonetic: '/kəˈnekt wɪð/',
                meaning: '把……和……连接或联系起来',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'overnight',
                phonetic: '/ˌəʊvə(r)ˈnaɪt/',
                meaning: '一夜之间；在夜间',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'review',
                phonetic: '/rɪˈvjuː/',
                meaning: '回顾；复习',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'knowledge',
                phonetic: '/ˈnɒlɪdʒ/, /ˈnɑːlɪdʒ/',
                meaning: '知识；学问',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'wisely',
                phonetic: '/ˈwaɪzli/',
                meaning: '明智地；聪明地',
                page: 6,
                requirement: 'listen_speak_read'
            },
            {
                word: 'lifelong',
                phonetic: '/ˈlaɪflɒŋ/',
                meaning: '终身的；毕生的',
                page: 6,
                requirement: 'listen_speak_read'
            }
        ],
        'Unit2 I think that mooncakes are delicious!': [
            {
                word: 'mooncake',
                phonetic: '/ˈmuːnkeɪk/',
                meaning: '月饼',
                page: 9,
                requirement: 'listen_speak_read'
            },
            {
                word: 'stranger',
                phonetic: '/ˈstreɪndʒə(r)/',
                meaning: '陌生人',
                page: 9,
                requirement: 'listen_speak_read'
            },
            {
                word: 'lantern',
                phonetic: '/ˈlæntən/',
                meaning: '灯笼',
                page: 10,
                requirement: 'listen_speak_read'
            },
            {
                word: 'relative',
                phonetic: '/ˈrelətɪv/',
                meaning: '亲属；亲戚',
                page: 10,
                requirement: 'listen_speak_read'
            },
            {
                word: 'put on',
                phonetic: '/pʊt ɒn/',
                meaning: '增加(体重)；发胖',
                page: 10,
                requirement: 'listen_speak_read'
            },
            {
                word: 'pound',
                phonetic: '/paʊnd/',
                meaning: '磅(重量单位)；英镑(英国货币单位)',
                page: 10,
                requirement: 'listen_speak_read'
            },
            {
                word: 'folk',
                phonetic: '/fəʊk/',
                meaning: '民间的；民俗的',
                page: 11,
                requirement: 'listen_speak_read'
            },
            {
                word: 'goddess',
                phonetic: '/ˈgɒdes/, /ˈgɑːdəs/',
                meaning: '女神',
                page: 11,
                requirement: 'listen_speak_read'
            },
            {
                word: 'whoever',
                phonetic: '/huːˈevə(r)/',
                meaning: '无论谁；不管什么人',
                page: 11,
                requirement: 'listen_speak_read'
            },
            {
                word: 'steal',
                phonetic: '/stiːl/',
                meaning: '偷；窃取',
                page: 11,
                requirement: 'listen_speak_read'
            },
            {
                word: 'lay',
                phonetic: '/leɪ/',
                meaning: '放置；安放；产(卵)；下(蛋)',
                page: 11,
                requirement: 'listen_speak_read'
            },
            {
                word: 'lay out',
                phonetic: '/leɪ aʊt/',
                meaning: '摆开；布置',
                page: 11,
                requirement: 'listen_speak_read'
            },
            {
                word: 'dessert',
                phonetic: '/dɪˈzɜː(r)t/',
                meaning: '(饭后)甜点；甜食',
                page: 11,
                requirement: 'listen_speak_read'
            },
            {
                word: 'garden',
                phonetic: '/ˈgɑː(r)dn/',
                meaning: '花园；园子',
                page: 11,
                requirement: 'listen_speak_read'
            },
            {
                word: 'tradition',
                phonetic: '/trəˈdɪʃn/',
                meaning: '传统',
                page: 11,
                requirement: 'listen_speak_read'
            },
            {
                word: 'admire',
                phonetic: '/ədˈmaɪə(r)/',
                meaning: '欣赏；仰慕',
                page: 11,
                requirement: 'listen_speak_read'
            },
            {
                word: 'tie',
                phonetic: '/taɪ/',
                meaning: '领带；捆；束',
                page: 12,
                requirement: 'listen_speak_read'
            },
            {
                word: 'haunted',
                phonetic: '/ˈhɔːntɪd/',
                meaning: '有鬼魂出没的；闹鬼的',
                page: 13,
                requirement: 'listen_speak_read'
            },
            {
                word: 'ghost',
                phonetic: '/gəʊst/',
                meaning: '鬼；鬼魂',
                page: 13,
                requirement: 'listen_speak_read'
            },
            {
                word: 'trick',
                phonetic: '/trɪk/',
                meaning: '花招；把戏',
                page: 13,
                requirement: 'listen_speak_read'
            },
            {
                word: 'treat',
                phonetic: '/triːt/',
                meaning: '款待；招待；招待；请(客)',
                page: 13,
                requirement: 'listen_speak_read'
            },
            {
                word: 'spider',
                phonetic: '/ˈspaɪdə(r)/',
                meaning: '蜘蛛',
                page: 13,
                requirement: 'listen_speak_read'
            },
            {
                word: 'Christmas',
                phonetic: '/ˈkrɪsməs/',
                meaning: '圣诞节',
                page: 14,
                requirement: 'listen_speak_read'
            },
            {
                word: 'lie',
                phonetic: '/laɪ/',
                meaning: '存在；平躺；处于',
                page: 14,
                requirement: 'listen_speak_read'
            },
            {
                word: 'novel',
                phonetic: '/ˈnɒvl/, /ˈnɑːvl/',
                meaning: '(长篇)小说',
                page: 14,
                requirement: 'listen_speak_read'
            },
            {
                word: 'eve',
                phonetic: '/iːv/',
                meaning: '前夕；前夜',
                page: 14,
                requirement: 'listen_speak_read'
            },
            {
                word: 'dead',
                phonetic: '/ded/',
                meaning: '死的；失去生命的',
                page: 14,
                requirement: 'listen_speak_read'
            },
            {
                word: 'business',
                phonetic: '/ˈbɪznəs/',
                meaning: '生意；商业',
                page: 14,
                requirement: 'listen_speak_read'
            },
            {
                word: 'punish',
                phonetic: '/ˈpʌnɪʃ/',
                meaning: '处罚；惩罚',
                page: 14,
                requirement: 'listen_speak_read'
            },
            {
                word: 'warn',
                phonetic: '/wɔː(r)n/',
                meaning: '警告；告诫',
                page: 14,
                requirement: 'listen_speak_read'
            },
            {
                word: 'end up',
                phonetic: '/end ʌp/',
                meaning: '最终成为；最后处于',
                page: 14,
                requirement: 'listen_speak_read'
            },
            {
                word: 'present',
                phonetic: '/ˈpreznt/',
                meaning: '现在；礼物；现在的',
                page: 14,
                requirement: 'listen_speak_read'
            },
            {
                word: 'warmth',
                phonetic: '/wɔː(r)mθ/',
                meaning: '温暖；暖和',
                page: 14,
                requirement: 'listen_speak_read'
            },
            {
                word: 'spread',
                phonetic: '/spred/',
                meaning: '传播；展开；蔓延；传播',
                page: 14,
                requirement: 'listen_speak_read'
            }
        ],
        'Unit3 Could you please tell me where the restrooms are?': [
            {
                word: 'restroom',
                phonetic: '/ˈrestruːm/',
                meaning: '(美)洗手间；公共厕所',
                page: 17,
                requirement: 'listen_speak_read'
            },
            {
                word: 'stamp',
                phonetic: '/stæmp/',
                meaning: '邮票；印章',
                page: 17,
                requirement: 'listen_speak_read'
            },
            {
                word: 'bookstore',
                phonetic: '/ˈbʊkstɔː(r)/',
                meaning: '书店',
                page: 17,
                requirement: 'listen_speak_read'
            },
            {
                word: 'beside',
                phonetic: '/bɪˈsaɪd/',
                meaning: '在……旁边；在……附近',
                page: 17,
                requirement: 'listen_speak_read'
            },
            {
                word: 'postcard',
                phonetic: '/ˈpəʊstkɑː(r)d/',
                meaning: '明信片',
                page: 18,
                requirement: 'listen_speak_read'
            },
            {
                word: 'pardon',
                phonetic: '/ˈpɑː(r)dn/',
                meaning: '原谅；请再说一遍',
                page: 18,
                requirement: 'listen_speak_read'
            },
            {
                word: 'washroom',
                phonetic: '/ˈwɒʃruːm/, /ˈwɑːʃruːm/',
                meaning: '洗手间；厕所',
                page: 18,
                requirement: 'listen_speak_read'
            },
            {
                word: 'bathroom',
                phonetic: '/ˈbɑːθruːm/, /ˈbæθruːm/',
                meaning: '浴室；洗手间',
                page: 18,
                requirement: 'listen_speak_read'
            },
            {
                word: 'normally',
                phonetic: '/ˈnɔː(r)məli/',
                meaning: '通常；正常情况下',
                page: 18,
                requirement: 'listen_speak_read'
            },
            {
                word: 'rush',
                phonetic: '/rʌʃ/',
                meaning: '仓促；急促',
                page: 18,
                requirement: 'listen_speak_read'
            },
            {
                word: 'suggest',
                phonetic: '/səˈdʒest/',
                meaning: '建议；提议',
                page: 19,
                requirement: 'listen_speak_read'
            },
            {
                word: 'pass by',
                phonetic: '/pɑːs baɪ/',
                meaning: '路过；经过',
                page: 19,
                requirement: 'listen_speak_read'
            },
            {
                word: 'staff',
                phonetic: '/stɑːf/, /stæf/',
                meaning: '管理人员；职工',
                page: 19,
                requirement: 'listen_speak_read'
            },
            {
                word: 'grape',
                phonetic: '/greɪp/',
                meaning: '葡萄',
                page: 20,
                requirement: 'listen_speak_read'
            },
            {
                word: 'central',
                phonetic: '/ˈsentrəl/',
                meaning: '中心的；中央的',
                page: 20,
                requirement: 'listen_speak_read'
            },
            {
                word: 'nearby',
                phonetic: '/ˌnɪəˈbaɪ/',
                meaning: '附近的；邻近的；在附近',
                page: 20,
                requirement: 'listen_speak_read'
            },
            {
                word: 'pardon me',
                phonetic: '/ˈpɑːdn miː/',
                meaning: '抱歉，对不起；什么，请再说一遍',
                page: 20,
                requirement: 'listen_speak_read'
            },
            {
                word: 'mail',
                phonetic: '/meɪl/',
                meaning: '邮寄；发电子邮件；邮件；信件',
                page: 20,
                requirement: 'listen_speak_read'
            },
            {
                word: 'east',
                phonetic: '/iːst/',
                meaning: '东方的；向东；东；东方',
                page: 20,
                requirement: 'listen_speak_read'
            },
            {
                word: 'fascinating',
                phonetic: '/ˈfæsɪneɪtɪŋ/',
                meaning: '迷人的；极有吸引力的',
                page: 21,
                requirement: 'listen_speak_read'
            },
            {
                word: 'inexpensive',
                phonetic: '/ˌɪnɪkˈspensɪv/',
                meaning: '不昂贵的',
                page: 21,
                requirement: 'listen_speak_read'
            },
            {
                word: 'uncrowded',
                phonetic: '/ʌnˈkraʊdɪd/',
                meaning: '不拥挤的；人少的',
                page: 21,
                requirement: 'listen_speak_read'
            },
            {
                word: 'convenient',
                phonetic: '/kənˈviːniənt/',
                meaning: '便利的；方便的',
                page: 21,
                requirement: 'listen_speak_read'
            },
            {
                word: 'mall',
                phonetic: '/mɔːl/',
                meaning: '商场；购物中心',
                page: 21,
                requirement: 'listen_speak_read'
            },
            {
                word: 'clerk',
                phonetic: '/klɑːk/, /klɜːrk/',
                meaning: '职员',
                page: 21,
                requirement: 'listen_speak_read'
            },
            {
                word: 'corner',
                phonetic: '/ˈkɔː(r)nə(r)/',
                meaning: '拐角；角落',
                page: 21,
                requirement: 'listen_speak_read'
            },
            {
                word: 'politely',
                phonetic: '/pəˈlaɪtli/',
                meaning: '礼貌地；客气地',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'request',
                phonetic: '/rɪˈkwest/',
                meaning: '要求；请求',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'direction',
                phonetic: '/dəˈrekʃn, daɪˈrekʃn/',
                meaning: '方向；方位',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'correct',
                phonetic: '/kəˈrekt/',
                meaning: '正确的；恰当的',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'polite',
                phonetic: '/pəˈlaɪt/',
                meaning: '有礼貌的；客气的',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'direct',
                phonetic: '/dəˈrekt, daɪˈrekt/',
                meaning: '直接的；直率的',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'speaker',
                phonetic: '/ˈspiːkə(r)/',
                meaning: '讲(某种语言)的人；发言者',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'whom',
                phonetic: '/huːm/',
                meaning: '谁；什么人',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'impolite',
                phonetic: '/ˌɪmpəˈlaɪt/',
                meaning: '不礼貌的；粗鲁的',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'address',
                phonetic: '/əˈdres/, /ˈædres/',
                meaning: '住址；地址；通信处',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'underground',
                phonetic: '/ˈʌndə(r)ɡraʊnd/',
                meaning: '地下的；地铁',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'parking lot',
                phonetic: '/ˈpɑːkɪŋ lɒt/',
                meaning: '停车场；停车区',
                page: 22,
                requirement: 'listen_speak_read'
            },
            {
                word: 'course',
                phonetic: '/kɔː(r)s/',
                meaning: '课程；学科',
                page: 23,
                requirement: 'listen_speak_read'
            }
        ],
        'Unit4 I used to be afraid of the dark.': [
            {
                word: 'humorous',
                phonetic: '/ˈhjuːmərəs/',
                meaning: '有幽默感的；滑稽有趣的',
                page: 26,
                requirement: 'listen_speak_read'
            },
            {
                word: 'silent',
                phonetic: '/ˈsaɪlənt/',
                meaning: '不说话的；沉默的',
                page: 26,
                requirement: 'listen_speak_read'
            },
            {
                word: 'helpful',
                phonetic: '/ˈhelpfl/',
                meaning: '有用的；有帮助的',
                page: 26,
                requirement: 'listen_speak_read'
            },
            {
                word: 'from time to time',
                phonetic: '/frəm taɪm tuː taɪm/',
                meaning: '时常；有时',
                page: 26,
                requirement: 'listen_speak_read'
            },
            {
                word: 'score',
                phonetic: '/skɔː(r)/',
                meaning: '得分；进球',
                page: 26,
                requirement: 'listen_speak_read'
            },
            {
                word: 'background',
                phonetic: '/ˈbækɡraʊnd/',
                meaning: '背景',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'interview',
                phonetic: '/ˈɪntə(r)vjuː/',
                meaning: '采访；面试；面试；访谈',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'Asian',
                phonetic: '/ˈeɪʃn, ˈeɪʒn/',
                meaning: '亚洲(人)的；亚洲人',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'deal',
                phonetic: '/diːl/',
                meaning: '对付；对待',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'deal with',
                phonetic: '/diːl wɪð/',
                meaning: '应对；处理',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'shyness',
                phonetic: '/ˈʃaɪnəs/',
                meaning: '害羞；腼腆',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'dare',
                phonetic: '/deə/, /der/',
                meaning: '敢于；胆敢',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'crowd',
                phonetic: '/kraʊd/',
                meaning: '人群；观众',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'ton',
                phonetic: '/tʌn/',
                meaning: '吨；(pl.)大量；许多',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'private',
                phonetic: '/ˈpraɪvət/',
                meaning: '私人的；私密的',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'guard',
                phonetic: '/ɡɑː(r)d/',
                meaning: '警卫；看守；守卫；保卫',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'require',
                phonetic: '/rɪˈkwaɪə(r)/',
                meaning: '需要；要求',
                page: 27,
                requirement: 'listen_speak_read'
            },
            {
                word: 'European',
                phonetic: '/ˌjʊərəˈpiːən/',
                meaning: '欧洲(人)的；欧洲人',
                page: 28,
                requirement: 'listen_speak_read'
            },
            {
                word: 'African',
                phonetic: '/ˈæfrɪkən/',
                meaning: '非洲(人)的；非洲人',
                page: 28,
                requirement: 'listen_speak_read'
            },
            {
                word: 'British',
                phonetic: '/ˈbrɪtɪʃ/',
                meaning: '英国(人)的',
                page: 28,
                requirement: 'listen_speak_read'
            },
            {
                word: 'speech',
                phonetic: '/spiːtʃ/',
                meaning: '讲话；发言',
                page: 28,
                requirement: 'listen_speak_read'
            },
            {
                word: 'public',
                phonetic: '/ˈpʌblɪk/',
                meaning: '民众；公开的；公众的',
                page: 28,
                requirement: 'listen_speak_read'
            },
            {
                word: 'in public',
                phonetic: '/ɪn ˈpʌblɪk/',
                meaning: '公开地；在别人(尤指生人)面前',
                page: 28,
                requirement: 'listen_speak_read'
            },
            {
                word: 'ant',
                phonetic: '/ænt/',
                meaning: '蚂蚁',
                page: 29,
                requirement: 'listen_speak_read'
            },
            {
                word: 'insect',
                phonetic: '/ˈɪnsekt/',
                meaning: '昆虫',
                page: 29,
                requirement: 'listen_speak_read'
            },
            {
                word: 'seldom',
                phonetic: '/ˈseldəm/',
                meaning: '不常；很少',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'influence',
                phonetic: '/ˈɪnfluəns/',
                meaning: '影响',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'absent',
                phonetic: '/ˈæbsənt/',
                meaning: '缺席；不在',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'fail',
                phonetic: '/feɪl/',
                meaning: '不及格；失败；未能(做到)',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'examination',
                phonetic: '/ɪɡˌzæmɪˈneɪʃn/',
                meaning: '考试；审查',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'boarding school',
                phonetic: '/ˈbɔːdɪŋ skuːl/',
                meaning: '寄宿学校',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'in person',
                phonetic: '/ɪn ˈpɜːsn/',
                meaning: '亲身；亲自',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'exactly',
                phonetic: '/ɪɡˈzæktli/',
                meaning: '确切地；精确地',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'pride',
                phonetic: '/praɪd/',
                meaning: '自豪；骄傲',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'take pride in',
                phonetic: '/teɪk praɪd ɪn/',
                meaning: '为……感到自豪',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'proud',
                phonetic: '/praʊd/',
                meaning: '自豪的；骄傲的',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'be proud of',
                phonetic: '/bi praʊd ɒv/',
                meaning: '为……骄傲；感到自豪',
                page: 30,
                requirement: 'listen_speak_read'
            },
            {
                word: 'general',
                phonetic: '/ˈdʒenrəl/',
                meaning: '总的；普遍的；常规的；将军',
                page: 32,
                requirement: 'listen_speak_read'
            },
            {
                word: 'introduction',
                phonetic: '/ˌɪntrəˈdʌkʃn/',
                meaning: '介绍',
                page: 32,
                requirement: 'listen_speak_read'
            }
        ],
        'Unit5 What are the shirts made of?': [
            {
                word: 'chopstick',
                phonetic: '/ˈtʃɒpstɪk/, /ˈtʃɑːpstɪk/',
                meaning: '筷子',
                page: 33,
                requirement: 'listen_speak_read'
            },
            {
                word: 'coin',
                phonetic: '/kɔɪn/',
                meaning: '硬币',
                page: 33,
                requirement: 'listen_speak_read'
            },
            {
                word: 'fork',
                phonetic: '/fɔː(r)k/',
                meaning: '餐叉；叉子',
                page: 33,
                requirement: 'listen_speak_read'
            },
            {
                word: 'blouse',
                phonetic: '/blaʊz/, /blaʊs/',
                meaning: '(女式)短上衣；衬衫',
                page: 33,
                requirement: 'listen_speak_read'
            },
            {
                word: 'silver',
                phonetic: '/ˈsɪlvə(r)/',
                meaning: '银；银器；银色的',
                page: 33,
                requirement: 'listen_speak_read'
            },
            {
                word: 'glass',
                phonetic: '/ɡlɑːs/, /ɡlæs/',
                meaning: '玻璃',
                page: 33,
                requirement: 'listen_speak_read'
            },
            {
                word: 'cotton',
                phonetic: '/ˈkɒtn/, /ˈkɑːtn/',
                meaning: '棉；棉花',
                page: 33,
                requirement: 'listen_speak_read'
            },
            {
                word: 'steel',
                phonetic: '/stiːl/',
                meaning: '钢；钢铁',
                page: 33,
                requirement: 'listen_speak_read'
            },
            {
                word: 'fair',
                phonetic: '/feə(r), fer/',
                meaning: '展览会；交易会',
                page: 34,
                requirement: 'listen_speak_read'
            },
            {
                word: 'environmental',
                phonetic: '/ɪnˌvaɪrənˈmentl/',
                meaning: '自然环境的；有关环境的',
                page: 34,
                requirement: 'listen_speak_read'
            },
            {
                word: 'grass',
                phonetic: '/ɡrɑːs/, /ɡræs/',
                meaning: '草；草地',
                page: 34,
                requirement: 'listen_speak_read'
            },
            {
                word: 'leaf',
                phonetic: '/liːf/',
                meaning: '叶；叶子',
                page: 34,
                requirement: 'listen_speak_read'
            },
            {
                word: 'produce',
                phonetic: '/prəˈdjuːs/, /prəˈduːs/',
                meaning: '生产；制造；出产',
                page: 34,
                requirement: 'listen_speak_read'
            },
            {
                word: 'widely',
                phonetic: '/ˈwaɪdli/',
                meaning: '广泛地；普遍地',
                page: 34,
                requirement: 'listen_speak_read'
            },
            {
                word: 'be known for',
                phonetic: '/bi nəʊn fɔː(r)/',
                meaning: '以……闻名；为人知晓',
                page: 34,
                requirement: 'listen_speak_read'
            },
            {
                word: 'process',
                phonetic: '/ˈprəʊses/',
                meaning: '加工；处理；过程',
                page: 34,
                requirement: 'listen_speak_read'
            },
            {
                word: 'pack',
                phonetic: '/pæk/',
                meaning: '包装；装箱',
                page: 34,
                requirement: 'listen_speak_read'
            },
            {
                word: 'product',
                phonetic: '/ˈprɒdʌkt/, /ˈprɑːdʌkt/',
                meaning: '产品；制品',
                page: 35,
                requirement: 'listen_speak_read'
            },
            {
                word: 'no matter',
                phonetic: '/nəʊ ˈmætə(r)/',
                meaning: '不论；无论',
                page: 35,
                requirement: 'listen_speak_read'
            },
            {
                word: 'local',
                phonetic: '/ˈləʊkl/',
                meaning: '当地的；本地的',
                page: 35,
                requirement: 'listen_speak_read'
            },
            {
                word: 'brand',
                phonetic: '/brænd/',
                meaning: '品牌；牌子',
                page: 35,
                requirement: 'listen_speak_read'
            },
            {
                word: 'avoid',
                phonetic: '/əˈvɔɪd/',
                meaning: '避免；回避',
                page: 35,
                requirement: 'listen_speak_read'
            },
            {
                word: 'handbag',
                phonetic: '/ˈhændbæɡ/',
                meaning: '小手提包',
                page: 35,
                requirement: 'listen_speak_read'
            },
            {
                word: 'mobile',
                phonetic: '/ˈməʊbaɪl/, /ˈmoʊbl/',
                meaning: '可移动的；非固定的',
                page: 35,
                requirement: 'listen_speak_read'
            },
            {
                word: 'everyday',
                phonetic: '/ˈevrideɪ/',
                meaning: '每天的；日常的',
                page: 35,
                requirement: 'listen_speak_read'
            },
            {
                word: 'boss',
                phonetic: '/bɒs/, /bɔːs/',
                meaning: '老板；上司',
                page: 36,
                requirement: 'listen_speak_read'
            },
            {
                word: 'Germany',
                phonetic: '/ˈdʒɜː(r)məni/',
                meaning: '德国',
                page: 36,
                requirement: 'listen_speak_read'
            },
            {
                word: 'surface',
                phonetic: '/ˈsɜː(r)fɪs/',
                meaning: '表面；表层',
                page: 36,
                requirement: 'listen_speak_read'
            },
            {
                word: 'material',
                phonetic: '/məˈtɪəriəl/',
                meaning: '材料；原料',
                page: 36,
                requirement: 'listen_speak_read'
            },
            {
                word: 'traffic',
                phonetic: '/ˈtræfɪk/',
                meaning: '交通；路上行驶的车辆',
                page: 36,
                requirement: 'listen_speak_read'
            },
            {
                word: 'postman',
                phonetic: '/ˈpəʊstmən/',
                meaning: '邮递员',
                page: 36,
                requirement: 'listen_speak_read'
            },
            {
                word: 'cap',
                phonetic: '/kæp/',
                meaning: '(尤指有帽舌的)帽子',
                page: 36,
                requirement: 'listen_speak_read'
            },
            {
                word: 'glove',
                phonetic: '/ɡlʌv/',
                meaning: '(分手指的)手套',
                page: 36,
                requirement: 'listen_speak_read'
            },
            {
                word: 'international',
                phonetic: '/ˌɪntə(r)ˈnæʃnəl/',
                meaning: '国际的',
                page: 37,
                requirement: 'listen_speak_read'
            },
            {
                word: 'competitor',
                phonetic: '/kəmˈpetɪtə(r)/',
                meaning: '参赛者；竞争者',
                page: 37,
                requirement: 'listen_speak_read'
            },
            {
                word: 'its',
                phonetic: '/ɪts/',
                meaning: '它的',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'form',
                phonetic: '/fɔː(r)m/',
                meaning: '形式；类型',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'clay',
                phonetic: '/kleɪ/',
                meaning: '黏土；陶土',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'celebration',
                phonetic: '/ˌselɪˈbreɪʃn/',
                meaning: '庆典；庆祝活动',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'balloon',
                phonetic: '/bəˈluːn/',
                meaning: '气球',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'paper cutting',
                phonetic: '/ˈpeɪpə kʌtɪŋ/',
                meaning: '剪纸',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'scissors',
                phonetic: '/ˈsɪzəz/',
                meaning: '(pl.)剪刀',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'lively',
                phonetic: '/ˈlaɪvli/',
                meaning: '生气勃勃的；(色彩)鲜艳的',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'fairy tale',
                phonetic: '/ˈfeəri teɪl/',
                meaning: '童话故事',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'historical',
                phonetic: '/hɪˈstɒrɪkl/, /hɪˈstɔːrɪkl/',
                meaning: '(有关)历史的',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'heat',
                phonetic: '/hiːt/',
                meaning: '热；高温；加热；变热',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'polish',
                phonetic: '/ˈpɒlɪʃ/, /ˈpɑːlɪʃ/',
                meaning: '磨光；修改；润色',
                page: 38,
                requirement: 'listen_speak_read'
            },
            {
                word: 'complete',
                phonetic: '/kəmˈpliːt/',
                meaning: '完成',
                page: 38,
                requirement: 'listen_speak_read'
            }
        ]
    },
    commonExpressions: {
        Unit1: [
            'How can we become good learners? 我们如何成为好的学习者？',
            'I study by reading the textbook. 我通过阅读课本来学习。',
            'What about listening to tapes? 听磁带怎么样？',
            "It's too hard to understand spoken English. 理解英语口语太难了。",
            "The more you read, the faster you'll be. 你读得越多，速度就会越快。"
        ],
        Unit2: [
            'I think that mooncakes are delicious! 我认为月饼很美味！',
            'What do you like most about the Mid-Autumn Festival? 关于中秋节，你最喜欢什么？',
            'People lay out mooncakes, fruits and other offerings. 人们摆出月饼、水果和其他祭品。',
            "I wonder if it's similar to the Water Festival of the Dai people in Yunnan Province. 我想知道它是否类似于云南省傣族的泼水节。",
            'I believe that April is the hottest month of the year there. 我认为那里四月是一年中最热的月份。'
        ],
        Unit3: [
            'Could you please tell me where the restrooms are? 你能告诉我洗手间在哪里吗？',
            'Sure, go along this street and turn left at the second crossing. 当然，沿着这条街走，在第二个十字路口左转。',
            'Do you know where I can buy some stamps? 你知道我在哪里可以买到邮票吗？',
            "I'm looking for a bookstore. 我在找一家书店。",
            'Could you tell me how to get to the nearest bank? 你能告诉我怎么去最近的银行吗？'
        ],
        Unit4: ['I used to be afraid of the dark. 我过去害怕黑暗。', 'He used to wear glasses. 他过去戴眼镜。', 'Did you use to have long hair? 你过去留长发吗？', "I didn't use to like tests. 我过去不喜欢考试。", "It's been three years since we last saw each other. 自从我们上次见面已经三年了。"],
        Unit5: ['What are the shirts made of? 这些衬衫是由什么制成的？', "They're made of cotton. 它们是棉制的。", 'Where is tea produced in China? 中国哪里产茶？', "It's produced in many different areas. 它在许多不同的地区生产。", "What's the model plane made of? 这个模型飞机是由什么制成的？"]
    }
}

// ===================== 2. SQL 转义工具（防止语法错误） =====================
function escapeSql(str) {
    if (!str) return "''"
    // 转义单引号，MySQL 标准转义
    if (typeof str === 'number') return `${str}`
    return `'${str?.replace(/'/g, "''") || ''}'`
}

// ===================== 3. 生成 SQL 语句 =====================
let sqlContent = ''
sqlContent += '-- 自动生成的英语教材数据导入脚本\n'
sqlContent += '-- 执行顺序：先建表 → 再执行此文件\n\n'

// -------- 生成 booktext 插入语句 --------
const book = bookData.bookInfo
const compilationUnit = ''
const fullModuleList = ''

// 获取插入后的教材 ID（自增 ID 默认 1）
const BOOK_ID = 13
sqlContent += `\n-- 插入单词数据，关联教材 ID = ${BOOK_ID}\n`

// -------- 生成 word 批量插入语句 --------
sqlContent += 'INSERT INTO word (book_id, unit_name, word, phonetic, meaning, page) VALUES\n'
const wordValues = []

for (const unitName in bookData.unitVocabulary) {
    const words = bookData.unitVocabulary[unitName]
    words.forEach((item) => {
        const line = `(
      ${BOOK_ID},
      ${escapeSql(unitName)},
      ${escapeSql(item.word)},
      ${escapeSql(item.phonetic)},
      ${escapeSql(item.meaning)},
      ${escapeSql(item.page)}
    )`
        wordValues.push(line.replace(/\s+/g, ' '))
    })
}
// 拼接单词语句
sqlContent += wordValues.join(',\n') + ';\n'

// ===================== 4. 写入 SQL 文件 =====================
console.log(sqlContent)
