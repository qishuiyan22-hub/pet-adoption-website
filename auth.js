// 用户数据管理
const Users = {
    storageKey: 'pet_users',
    currentUserKey: 'pet_current_user',

    // 获取所有用户
    getUsers: function() {
        const users = localStorage.getItem(this.storageKey);
        return users ? JSON.parse(users) : [];
    },

    // 保存用户
    saveUser: function(user) {
        const users = this.getUsers();
        const exists = users.find(u => u.email === user.email);
        if (!exists) {
            users.push(user);
            localStorage.setItem(this.storageKey, JSON.stringify(users));
        }
    },

    // 验证用户登录
    validateLogin: function(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            this.setCurrentUser(user);
            return user;
        }
        return null;
    },

    // 设置当前用户
    setCurrentUser: function(user) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    },

    // 获取当前用户
    getCurrentUser: function() {
        const user = localStorage.getItem(this.currentUserKey);
        return user ? JSON.parse(user) : null;
    },

    // 退出登录
    logout: function() {
        localStorage.removeItem(this.currentUserKey);
    },

    // 检查是否为管理员
    isAdmin: function(email) {
        return email === '3133785281@qq.com';
    },

    // 初始化管理员账号
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

// 初始化管理员账号
Users.initAdmin();

// 更新导航栏的登录/注册状态
function updateNavAuth() {
    const authContainer = document.getElementById('auth-container');
    const mobileAuthContainer = document.getElementById('mobile-auth-container');
    const currentUser = Users.getCurrentUser();

    if (currentUser) {
        const displayName = currentUser.name;
        const isAdmin = Users.isAdmin(currentUser.email);
        const adminTag = isAdmin ? '<span class="text-red-500 text-sm ml-1">（管理员）</span>' : '';
        const adminLink = isAdmin ? '<a href="admin.html" class="text-red-500 hover:text-red-600 transition-colors ml-4"><i class="fa fa-cog mr-1"></i>管理</a>' : '';

        const authHTML = `
            <span class="text-dark">${displayName}${adminTag}</span>
            ${adminLink}
            <a href="#" id="logout-btn" class="text-dark hover:text-primary transition-colors ml-4">退出</a>
        `;

        const mobileAuthHTML = `
            <span class="text-dark py-2">${displayName}${adminTag}</span>
            ${isAdmin ? '<a href="admin.html" class="text-red-500 hover:text-red-600 transition-colors py-2"><i class="fa fa-cog mr-1"></i>管理</a>' : ''}
            <a href="#" id="mobile-logout-btn" class="text-dark hover:text-primary transition-colors py-2">退出</a>
        `;

        if (authContainer) authContainer.innerHTML = authHTML;
        if (mobileAuthContainer) mobileAuthContainer.innerHTML = mobileAuthHTML;

        // 绑定退出按钮事件
        document.getElementById('logout-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            Users.logout();
            window.location.href = 'index.html';
        });

        document.getElementById('mobile-logout-btn')?.addEventListener('click', function(e) {
            e.preventDefault();
            Users.logout();
            window.location.href = 'index.html';
        });
    }
}

// 页面加载时更新导航栏
document.addEventListener('DOMContentLoaded', function() {
    updateNavAuth();
});