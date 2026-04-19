/**
 * 宠遇宠物领养和寄养网站 - JavaScript 主文件
 * 包含用户管理、宠物管理、机构管理等功能
 */

// ============================================
// 用户数据管理模块
// ============================================
const Users = {
    storageKey: 'pet_users',           // localStorage中存储用户数据的键名
    currentUserKey: 'pet_current_user', // localStorage中存储当前登录用户的键名

    // 获取所有注册用户
    getUsers: function() {
        const users = localStorage.getItem(this.storageKey);
        return users ? JSON.parse(users) : [];
    },

    // 保存新用户到localStorage
    saveUser: function(user) {
        const users = this.getUsers();
        // 检查邮箱是否已被注册
        const exists = users.find(u => u.email === user.email);
        if (!exists) {
            users.push(user);
            localStorage.setItem(this.storageKey, JSON.stringify(users));
            return true;  // 注册成功
        }
        return false;     // 邮箱已被注册
    },

    // 验证用户登录信息
    validateLogin: function(email, password) {
        const users = this.getUsers();
        // 查找匹配的用户
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            this.setCurrentUser(user);  // 设置当前登录用户
            return user;
        }
        return null;  // 登录失败
    },

    // 将用户信息存储到localStorage作为当前登录用户
    setCurrentUser: function(user) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    },

    // 获取当前登录用户
    getCurrentUser: function() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    },

    // 清除当前登录用户（退出登录）
    logout: function() {
        localStorage.removeItem(this.currentUserKey);
    },

    // 检查是否为管理员账号
    isAdmin: function(email) {
        return email === '3133785281@qq.com';
    },

    // 初始化管理员账号（如果不存在则创建）
    initAdmin: function() {
        const users = this.getUsers();
        const adminExists = users.find(u => u.email === '3133785281@qq.com');
        if (!adminExists) {
            users.push({
                name: '管理员',
                email: '3133785281@qq.com',
                password: '13705028226'
            });
            localStorage.setItem(this.storageKey, JSON.stringify(users));
        }
    }
};

// 页面加载时自动初始化管理员账号
Users.initAdmin();


// ============================================
// 导航栏登录状态管理模块
// ============================================

/**
 * 更新导航栏的登录/注册状态显示
 * 根据用户登录状态显示不同的内容
 * - 未登录：显示"登录"和"注册"按钮
 * - 已登录：显示用户名、管理员标记（如果是管理员）、退出按钮
 */
function updateNavAuth() {
    const authContainer = document.getElementById('auth-container');        // 桌面端导航栏容器
    const mobileAuthContainer = document.getElementById('mobile-auth-container');  // 移动端导航栏容器
    const currentUser = Users.getCurrentUser();

    if (currentUser) {
        // 用户已登录，显示用户名和管理员信息
        const displayName = currentUser.name;
        const isAdmin = Users.isAdmin(currentUser.email);
        // 如果是管理员，添加红色"（管理员）"标记
        const adminTag = isAdmin ? '<span class="text-red-500 text-sm ml-1">（管理员）</span>' : '';
        // 如果是管理员，添加"管理"链接
        const adminLink = isAdmin ? '<a href="admin.html" class="text-red-500 hover:text-red-600 transition-colors ml-4"><i class="fa fa-cog mr-1"></i>管理</a>' : '';

        // 桌面端导航栏HTML
        const authHTML = `
            <span class="text-dark">${displayName}${adminTag}</span>
            ${adminLink}
            <a href="#" id="logout-btn" class="text-dark hover:text-primary transition-colors ml-4">退出</a>
        `;

        // 移动端导航栏HTML
        const mobileAuthHTML = `
            <span class="text-dark py-2">${displayName}${adminTag}</span>
            ${isAdmin ? '<a href="admin.html" class="text-red-500 hover:text-red-600 transition-colors py-2"><i class="fa fa-cog mr-1"></i>管理</a>' : ''}
            <a href="#" id="mobile-logout-btn" class="text-dark hover:text-primary transition-colors py-2">退出</a>
        `;

        // 更新导航栏HTML
        if (authContainer) authContainer.innerHTML = authHTML;
        if (mobileAuthContainer) mobileAuthContainer.innerHTML = mobileAuthHTML;

        // 绑定桌面端退出按钮事件
        document.getElementById('logout-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            Users.logout();
            window.location.href = 'index.html';
        });

        // 绑定移动端退出按钮事件
        document.getElementById('mobile-logout-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            Users.logout();
            window.location.href = 'index.html';
        });
    }
    // 如果用户未登录，导航栏保持默认的"登录"和"注册"按钮
}

// 页面加载时自动更新导航栏状态
document.addEventListener('DOMContentLoaded', function() {
    updateNavAuth();
});


// ============================================
// 宠物数据管理模块（供领养页面使用）
// ============================================
const Pets = {
    storageKey: 'pet_pets',  // localStorage中存储管理员添加的宠物数据的键名

    // 获取管理员添加的所有宠物
    getCustomPets: function() {
        const pets = localStorage.getItem(this.storageKey);
        return pets ? JSON.parse(pets) : [];
    },

    // 保存宠物到localStorage
    savePet: function(pet) {
        const pets = this.getCustomPets();
        // 生成新宠物ID（基于时间戳）
        pet.id = Date.now();
        pets.push(pet);
        localStorage.setItem(this.storageKey, JSON.stringify(pets));
        return pet;
    },

    // 删除宠物
    deletePet: function(petId) {
        const pets = this.getCustomPets();
        const filteredPets = pets.filter(p => p.id !== petId);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredPets));
    },

    // 获取所有宠物（包括默认宠物和管理员添加的宠物）
    getAllPets: function() {
        const customPets = this.getCustomPets();
        return [...defaultPets, ...customPets];
    }
};


// ============================================
// 合作机构数据管理模块（供寄养页面使用）
// ============================================
const Agencies = {
    storageKey: 'pet_agencies',  // localStorage中存储管理员添加的机构数据的键名

    // 获取管理员添加的所有机构
    getAgencies: function() {
        const agencies = localStorage.getItem(this.storageKey);
        return agencies ? JSON.parse(agencies) : [];
    },

    // 保存机构到localStorage
    saveAgency: function(agency) {
        const agencies = this.getAgencies();
        // 生成新机构ID（基于时间戳）
        agency.id = Date.now();
        agencies.push(agency);
        localStorage.setItem(this.storageKey, JSON.stringify(agencies));
        return agency;
    },

    // 删除机构
    deleteAgency: function(agencyId) {
        const agencies = this.getAgencies();
        const filteredAgencies = agencies.filter(a => a.id !== agencyId);
        localStorage.setItem(this.storageKey, JSON.stringify(filteredAgencies));
    },

    // 获取所有机构（包括默认机构和管理员添加的机构）
    getAllAgencies: function() {
        const customAgencies = this.getAgencies();
        // 如果有自定义机构则使用，否则使用默认机构
        return customAgencies.length > 0 ? customAgencies : defaultAgencies;
    }
};


// ============================================
// 默认宠物数据（不可删除）
// ============================================
const defaultPets = [
    {
        id: 1,
        name: '小白',
        type: 'cat',
        age: '1岁',
        gender: 'male',
        personality: 'active',
        description: '小白是一只非常活泼可爱的猫咪，喜欢与人互动，会用头蹭你求抚摸。已经接种了所有疫苗，非常健康。',
        image: 'photo/动物1.png'
    },
    {
        id: 2,
        name: '小黑',
        type: 'dog',
        age: '2岁',
        gender: 'female',
        personality: 'friendly',
        description: '小黑是一只非常友善的狗狗，对人很热情，喜欢和小朋友一起玩。已经训练过，会听从基本指令。',
        image: 'photo/动物2.png'
    },
    {
        id: 3,
        name: '小灰',
        type: 'other',
        age: '6个月',
        gender: 'male',
        personality: 'calm',
        description: '小灰是一只非常温顺的兔子，喜欢安静的环境，毛茸茸的非常可爱。已经学会使用便盆，很干净。',
        image: 'photo/动物3.png'
    },
    {
        id: 4,
        name: '小花',
        type: 'cat',
        age: '3个月',
        gender: 'female',
        personality: 'active',
        description: '小花是一只非常活泼好动的小猫，对周围的一切都充满了好奇心，喜欢玩逗猫棒。',
        image: 'photo/动物4.png'
    },
    {
        id: 5,
        name: '小黄',
        type: 'dog',
        age: '4个月',
        gender: 'male',
        personality: 'active',
        description: '小黄是一只非常可爱的小狗，精力充沛，喜欢和人一起玩。正在学习基本的训练，非常聪明。',
        image: 'photo/动物5.png'
    },
    {
        id: 6,
        name: '小仓鼠',
        type: 'other',
        age: '2个月',
        gender: 'male',
        personality: 'active',
        description: '小仓鼠是一只非常可爱的小宠物，体型小巧，容易照顾。喜欢在笼子里跑来跑去，非常有趣。',
        image: 'photo/动物6.png'
    }
];


// ============================================
// 默认合作机构数据（不可删除）
// ============================================
const defaultAgencies = [
    {
        id: 1,
        name: '爱心宠物家园',
        area: '仓山区',
        price: '¥80/天起',
        rating: '4.5 (120条评价)',
        description: '提供专业的宠物寄养服务，环境舒适，照顾细心，是你出差旅行时的最佳选择。'
    },
    {
        id: 2,
        name: '宠物乐园',
        area: '台江区',
        price: '¥120/天起',
        rating: '5.0 (89条评价)',
        description: '豪华宠物寄养环境，提供24小时专人照顾，让你的宠物享受星级待遇。'
    },
    {
        id: 3,
        name: '快乐宠物中心',
        area: '鼓楼区',
        price: '¥60/天起',
        rating: '4.0 (67条评价)',
        description: '提供活泼有趣的寄养环境，让你的宠物在玩耍中度过愉快的时光。'
    }
];


// ============================================
// 宠物类型转换函数
// ============================================

/**
 * 将宠物类型代码转换为中文名称
 * @param {string} type - 宠物类型代码 (cat/dog/other)
 * @returns {string} 中文名称
 */
function getTypeText(type) {
    switch(type) {
        case 'cat': return '猫咪';
        case 'dog': return '狗狗';
        case 'other': return '其他';
        default: return type;
    }
}

/**
 * 将宠物性别代码转换为中文名称
 * @param {string} gender - 性别代码 (male/female)
 * @returns {string} 中文名称
 */
function getGenderText(gender) {
    switch(gender) {
        case 'male': return '公';
        case 'female': return '母';
        default: return gender;
    }
}

/**
 * 将宠物性格代码转换为中文名称
 * @param {string} personality - 性格代码 (active/calm/friendly/shy)
 * @returns {string} 中文名称
 */
function getPersonalityText(personality) {
    switch(personality) {
        case 'active': return '活泼';
        case 'calm': return '安静';
        case 'friendly': return '友善';
        case 'shy': return '害羞';
        default: return personality;
    }
}

/**
 * 将宠物年龄转换为年龄分类代码
 * @param {string} age - 年龄字符串
 * @returns {string} 年龄分类代码 (baby/young/adult/senior)
 */
function getAgeCategory(age) {
    if (age.includes('个月')) {
        return 'baby';
    } else if (age.includes('1岁') || age.includes('2岁')) {
        return 'young';
    } else if (age.includes('3岁') || age.includes('4岁') || age.includes('5岁')) {
        return 'adult';
    } else {
        return 'senior';
    }
}


// ============================================
// 移动端菜单切换函数
// ============================================

/**
 * 切换移动端导航菜单的显示/隐藏状态
 */
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}


// ============================================
// FAQ折叠切换函数
// ============================================

/**
 * 切换FAQ问答的展开/折叠状态
 * @param {HTMLElement} element - 被点击的FAQ按钮元素
 */
function toggleFAQ(element) {
    const content = element.nextElementSibling;  // 获取FAQ答案内容
    const icon = element.querySelector('i');     // 获取箭头图标
    content.classList.toggle('hidden');          // 切换答案显示/隐藏
    icon.classList.toggle('rotate-180');          // 切换箭头旋转方向
}
