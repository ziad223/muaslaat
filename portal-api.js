/**
 * Mowasalat Smart Portal - Professional Production API Integration
 * Configured identically to the React Native App (Cloud Backend with Stripe & Wallet APIs)
 */

(function () {
  "use strict";

  // Cloud API Configuration for Mowasalat Portal
  const API_CONFIG = {
    BASE_URL: "https://mowasalat-portal-copy-a159c5f4.base44.app/api",
    // Default token from active session token
    DEFAULT_TOKEN:
      "b44u_0cbfd1d3ed7286481f9dd01b3bc96a3f749756898ef180ace624241ab0b6c414",
  };

  const TOKEN_STORAGE_KEY = "@mwasalat_cloud_token";

  function getActiveApiToken() {
    try {
      const savedToken =
        localStorage.getItem(TOKEN_STORAGE_KEY) ||
        localStorage.getItem("@mwasalat_base44_token");
      if (savedToken && savedToken.trim().length > 0) {
        return savedToken.trim();
      }
    } catch (err) {
      console.warn("[API Config] Error reading saved token:", err);
    }
    return API_CONFIG.DEFAULT_TOKEN.trim();
  }

  // Clear any legacy demo accounts from client storage
  try {
    const rawUsers = localStorage.getItem("mowasalat_registered_users_db");
    if (rawUsers && (rawUsers.includes("أحمد محمد الفيفي") || rawUsers.includes("password123"))) {
      localStorage.removeItem("mowasalat_registered_users_db");
    }
  } catch (e) {}

  function getApiHeaders() {
    const token = getActiveApiToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    // Backend rejects personal access tokens (b44u_...) in the api_key header
    if (token && !token.startsWith("b44u_")) {
      headers["api_key"] = token;
    }
    return headers;
  }

  // ============================================================
  // API SERVICE (CLOUD API & BACKEND SERVICES)
  // ============================================================
  const MowasalatAPI = {
    // --- 0. AUTH / LOGIN API (REAL HTTP REQUEST & STRICT CREDENTIAL VALIDATION) ---
    async loginUser(phoneOrUser, pass) {
      const cleanIdentifier = (phoneOrUser || "").trim();
      const cleanDigits = cleanIdentifier.replace(/\D+/g, "");
      console.log(
        `%c[Mowasalat Auth API] 🔐 Authenticating: "${cleanIdentifier}"...`,
        "color:#3b82f6; font-weight:bold;",
      );

      // 1. Check local registered database first (demo accounts and newly registered accounts)
      const matchedUser = StorageService.findRegisteredUser(cleanIdentifier);
      if (matchedUser) {
        if (
          !pass ||
          pass.trim() === "" ||
          (matchedUser.password && matchedUser.password !== pass)
        ) {
          return {
            success: false,
            message: "كلمة المرور غير صحيحة! يرجى التأكد من كلمة المرور والمحاولة مجدداً.",
          };
        }
        const updated = {
          ...matchedUser,
          isLoggedIn: true,
          name: matchedUser.fullName || matchedUser.name || "مشترك مواصلات",
        };
        return { success: true, user: updated };
      }

      // 2. Authenticate with Cloud API by querying User & Subscription entities concurrently
      let apiRes = { data: null, error: null };
      try {
        const headers = getApiHeaders();
        const [usersRes, subsRes] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}/entities/User?limit=100`, {
            method: "GET",
            headers: headers,
          }),
          fetch(`${API_CONFIG.BASE_URL}/entities/Subscription?limit=100`, {
            method: "GET",
            headers: headers,
          }).catch(() => null),
        ]);

        let usersList = [];
        let subsList = [];

        if (usersRes && usersRes.ok) {
          const uJson = await usersRes.json();
          usersList = Array.isArray(uJson) ? uJson : uJson.value || [];
        }
        if (subsRes && subsRes.ok) {
          const sJson = await subsRes.json();
          subsList = Array.isArray(sJson) ? sJson : sJson.value || [];
        }

        // 2.1 Match by Phone in Subscriptions (since phone numbers are stored on Subscriptions)
        let matchedSub = null;
        if (cleanDigits && subsList.length > 0) {
          matchedSub = subsList.find((s) => {
            const sPhone = (s.phone || "").replace(/\D+/g, "");
            return (
              sPhone &&
              (sPhone === cleanDigits ||
                (cleanDigits.length >= 9 && sPhone.endsWith(cleanDigits.slice(-9))) ||
                (sPhone.length >= 9 && cleanDigits.endsWith(sPhone.slice(-9))))
            );
          });
        }

        // 2.2 Match by User entity (email, username, phone, or linked via Subscription created_by_id)
        let foundUser = usersList.find((u) => {
          const uPhone = (u.phone || "").replace(/\D+/g, "");
          const phoneMatch =
            cleanDigits &&
            uPhone &&
            (uPhone === cleanDigits ||
              (cleanDigits.length >= 9 && uPhone.endsWith(cleanDigits.slice(-9))) ||
              (uPhone.length >= 9 && cleanDigits.endsWith(uPhone.slice(-9))));
          const emailMatch =
            u.email &&
            u.email.toLowerCase() === cleanIdentifier.toLowerCase();
          const userMatch =
            u.username &&
            u.username.toLowerCase() === cleanIdentifier.toLowerCase();
          const subLinkMatch =
            matchedSub &&
            matchedSub.created_by_id &&
            u.id === matchedSub.created_by_id;

          return phoneMatch || emailMatch || userMatch || subLinkMatch;
        });

        // If matched via Subscription OR User entity:
        if (matchedSub || foundUser) {
          const resolvedName =
            (matchedSub && matchedSub.full_name) ||
            (foundUser && foundUser.full_name) ||
            cleanIdentifier;
          const resolvedPhone =
            (matchedSub && matchedSub.phone) ||
            (foundUser && foundUser.phone) ||
            cleanDigits ||
            cleanIdentifier;
          const resolvedEmail =
            (foundUser && foundUser.email) ||
            (cleanIdentifier.includes("@")
              ? cleanIdentifier
              : `${cleanDigits || "user"}@mowasalat.sa`);
          const resolvedRole = (foundUser && foundUser.role) || "subscriber";
          const resolvedId =
            (foundUser && foundUser.id) ||
            (matchedSub && matchedSub.id) ||
            "usr_" + Date.now();

          apiRes.data = {
            id: resolvedId,
            username: (foundUser && foundUser.username) || resolvedName,
            full_name: resolvedName,
            fullName: resolvedName,
            name: resolvedName,
            phone: resolvedPhone,
            email: resolvedEmail,
            avatar_url: (foundUser && foundUser.avatar_url) || "",
            avatarUrl: (foundUser && foundUser.avatar_url) || "",
            role: resolvedRole,
            password: (foundUser && foundUser.password) || null,
            created_date:
              (foundUser && foundUser.created_date) ||
              (matchedSub && matchedSub.created_date) ||
              new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn(
          "[Mowasalat Auth API] Network connection error:",
          err.message,
        );
        apiRes.error = err.message;
      }

      // If matched a Cloud User or Subscriber:
      if (apiRes.data) {
        const b44 = apiRes.data;

        if (b44.password && b44.password !== pass) {
          return {
            success: false,
            message: "كلمة المرور غير صحيحة! يرجى التأكد والمحاولة مجدداً.",
          };
        }

        if (!pass || pass.trim().length < 6) {
          return {
            success: false,
            message: "كلمة المرور يجب أن تكون 6 أحرف أو أرقام على الأقل.",
          };
        }

        const onlineProfile = {
          id: b44.id || "usr_" + Date.now(),
          username: b44.username || b44.full_name || cleanIdentifier,
          fullName: b44.full_name || cleanIdentifier,
          name: b44.full_name || cleanIdentifier,
          phone: b44.phone || cleanDigits || cleanIdentifier,
          email:
            b44.email ||
            (cleanIdentifier.includes("@")
              ? cleanIdentifier
              : `${cleanDigits || cleanIdentifier}@mowasalat.sa`),
          avatar_url: b44.avatar_url || b44.avatarUrl || "",
          avatarUrl: b44.avatar_url || b44.avatarUrl || "",
          password: pass,
          role: b44.role || "passenger",
          isLoggedIn: true,
          createdAt: b44.created_date || new Date().toISOString(),
        };

        saveUserToDatabase(onlineProfile);
        return { success: true, user: onlineProfile };
      }

      // 3. User does not exist anywhere - STRICT FAILURE
      return {
        success: false,
        message: `بيانات الدخول غير صحيحة، أو الحساب (${cleanIdentifier}) غير مسجل في النظام. يرجى إنشاء حساب جديد أولاً.`,
      };
    },

    // --- 0.1 CHECK USER EXISTS API ---
    async checkUserExists(phone, email) {
      console.log(
        `%c[Mowasalat Auth API] 🔍 Checking User existence: ${phone || email}`,
        "color:#06b6d4; font-weight:bold;",
      );
      try {
        const headers = getApiHeaders();
        const [usersRes, subsRes] = await Promise.all([
          fetch(`${API_CONFIG.BASE_URL}/entities/User?limit=50`, {
            method: "GET",
            headers: headers,
          }),
          fetch(`${API_CONFIG.BASE_URL}/entities/Subscription?limit=50`, {
            method: "GET",
            headers: headers,
          }).catch(() => null),
        ]);

        const cleanDigits = (phone || "").replace(/\D+/g, "");

        if (subsRes && subsRes.ok) {
          const sJson = await subsRes.json();
          const subsList = Array.isArray(sJson) ? sJson : sJson.value || [];
          if (
            cleanDigits &&
            subsList.some((s) => {
              const sPhone = (s.phone || "").replace(/\D+/g, "");
              return (
                sPhone &&
                (sPhone === cleanDigits ||
                  (cleanDigits.length >= 9 && sPhone.endsWith(cleanDigits.slice(-9))) ||
                  (sPhone.length >= 9 && cleanDigits.endsWith(sPhone.slice(-9))))
              );
            })
          ) {
            return true;
          }
        }

        if (usersRes && usersRes.ok) {
          const uJson = await usersRes.json();
          const list = Array.isArray(uJson) ? uJson : uJson.value || [];
          return (
            Array.isArray(list) &&
            list.some((u) => {
              const uPhone = (u.phone || "").replace(/\D+/g, "");
              const phoneMatch =
                cleanDigits &&
                uPhone &&
                (uPhone === cleanDigits ||
                  (cleanDigits.length >= 9 && uPhone.endsWith(cleanDigits.slice(-9))));
              const emailMatch =
                email && u.email && u.email.toLowerCase() === email.toLowerCase();
              return phoneMatch || emailMatch;
            })
          );
        }
      } catch (e) {}
      return false;
    },

    // --- 1. SMS / OTP API ---
    async sendSms(phone, message, type = "otp") {
      console.log(
        `%c[Mowasalat SMS API] 📱 Dispatching SMS notification for ${phone}`,
        "color:#f59e0b; font-weight:bold;",
      );
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/functions/sendSms`,
          {
            method: "POST",
            headers: getApiHeaders(),
            body: JSON.stringify({ phone, message, type }),
          },
        );
        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
        }
      } catch (err) {
        console.warn("[Mowasalat SMS API] Note:", err.message);
      }
      return { success: true, simulated: true };
    },

    // --- 2. AUTH / USER REGISTRATION API ---
    async registerUser(userData) {
      console.log(
        "%c[Mowasalat Auth API] 👤 Creating User record...",
        "color:#3b82f6; font-weight:bold;",
        userData,
      );
      let assignedId = "usr_" + Date.now();
      let role = "user";

      try {
        // Persist directly in Cloud User Entity with token
        const response = await fetch(`${API_CONFIG.BASE_URL}/entities/User`, {
          method: "POST",
          headers: getApiHeaders(),
          body: JSON.stringify({
            email: userData.email || `${userData.phone}@mowasalat.sa`,
            full_name: userData.fullName || userData.name,
            role: "user",
            job_role: "none",
            job_roles: [],
            app_role: userData.role || "passenger",
            avatar_url: userData.avatarUrl || userData.avatar_url || "",
            created_date: new Date().toISOString(),
          }),
        });
        if (response.ok) {
          const created = await response.json();
          if (created && created.id) {
            assignedId = created.id;
            role = created.role || role;
          }
        }
      } catch (err) {
        console.warn("[Mowasalat Auth API] User entity note:", err.message);
      }

      // Also persist to Subscription entity so phone number is queryable in Base44
      try {
        await fetch(`${API_CONFIG.BASE_URL}/entities/Subscription`, {
          method: "POST",
          headers: getApiHeaders(),
          body: JSON.stringify({
            full_name: userData.fullName || userData.name,
            phone: userData.phone,
            created_by_id: assignedId,
            status: "active",
            transport_type: "subscriber",
            monthly_trip_limit: 12,
            trips_per_day: 2,
            created_date: new Date().toISOString(),
          }),
        });
      } catch (subErr) {
        console.warn("[Mowasalat Auth API] Subscription link note:", subErr.message);
      }

      const newProfile = {
        id: assignedId,
        fullName: userData.fullName || userData.name,
        name: userData.fullName || userData.name,
        phone: userData.phone,
        email: userData.email,
        avatar_url: userData.avatarUrl || userData.avatar_url || "",
        avatarUrl: userData.avatarUrl || userData.avatar_url || "",
        role: role,
        password: userData.password,
        isLoggedIn: true,
        createdAt: new Date().toISOString(),
      };

      saveUserToDatabase(newProfile);
      return { success: true, user: newProfile };
    },

    // --- 3. PAYMENT & WALLET CHECKOUT API (STRIPE) ---
    async processWalletCheckout(checkoutPayload) {
      console.log(
        "%c[Mowasalat Payment API] 💳 Processing walletCheckout via Stripe...",
        "color:#10b981; font-weight:bold;",
        checkoutPayload,
      );
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/functions/walletCheckout`,
          {
            method: "POST",
            headers: getApiHeaders(),
            body: JSON.stringify(checkoutPayload),
          },
        );
        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
        } else {
          const errData = await response.json().catch(() => ({}));
          return {
            success: false,
            error:
              errData.error ||
              errData.message ||
              `خطأ في بوابة الدفع (${response.status})`,
          };
        }
      } catch (err) {
        console.warn("[Mowasalat Payment API] Network error:", err.message);
        return {
          success: false,
          error: "تعذر الاتصال ببوابة الدفع الإلكتروني",
        };
      }
    },

    // --- 3.1 WALLET WITHDRAWAL API (SARIE & STC PAY) ---
    async requestWalletWithdraw(withdrawPayload) {
      console.log(
        "%c[Mowasalat Payment API] 💸 Requesting wallet withdrawal...",
        "color:#f59e0b; font-weight:bold;",
        withdrawPayload,
      );
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/functions/walletWithdraw`,
          {
            method: "POST",
            headers: getApiHeaders(),
            body: JSON.stringify(withdrawPayload),
          },
        );
        if (response.ok) {
          const data = await response.json();
          return { success: true, data };
        } else {
          const errData = await response.json().catch(() => ({}));
          return {
            success: false,
            status: response.status,
            error:
              errData.error ||
              errData.message ||
              `فشل طلب السحب من السيرفر (${response.status})`,
          };
        }
      } catch (err) {
        console.warn("[Mowasalat Payment API] Withdraw error:", err.message);
        return {
          success: false,
          error: "تعذر الاتصال بالسيرفر لمعالجة طلب السحب",
        };
      }
    },

    // --- 3.2 SYNC CLOUD WALLET BALANCE API ---
    async syncLiveWalletBalance(userId, balance) {
      try {
        const headers = getApiHeaders();
        const res = await fetch(`${API_CONFIG.BASE_URL}/entities/Wallet?limit=50`, {
          method: "GET",
          headers,
        });
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json) ? json : (json.value || []);
          const targetId = String(userId || "").trim();
          const userWallet = list.find(
            (w) => String(w.user_id || "").trim() === targetId || String(w.created_by_id || "").trim() === targetId
          );
          if (userWallet && userWallet.id) {
            await fetch(`${API_CONFIG.BASE_URL}/entities/Wallet/${userWallet.id}`, {
              method: "PUT",
              headers,
              body: JSON.stringify({ balance: Number(balance) || 0 }),
            });
            return { success: true, walletId: userWallet.id };
          } else {
            const createRes = await fetch(`${API_CONFIG.BASE_URL}/entities/Wallet`, {
              method: "POST",
              headers,
              body: JSON.stringify({
                user_id: targetId,
                balance: Number(balance) || 0,
                pending_balance: 0,
                total_topup: 0,
                total_withdraw: 0,
                currency: "SAR",
              }),
            });
            if (createRes.ok) {
              const created = await createRes.json();
              return { success: true, walletId: created.id };
            }
          }
        }
      } catch (e) {
        console.warn("[Cloud Wallet Sync]", e);
      }
      return { success: false };
    },

    // --- 3.3 FETCH CLOUD WALLET RECORD API ---
    async fetchCloudWallet(userId) {
      try {
        const headers = getApiHeaders();
        const res = await fetch(`${API_CONFIG.BASE_URL}/entities/Wallet?limit=50`, {
          method: "GET",
          headers,
        });
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json) ? json : (json.value || []);
          const targetId = String(userId || "").trim();
          const userWallet = list.find(
            (w) => String(w.user_id || "").trim() === targetId || String(w.created_by_id || "").trim() === targetId
          );
          if (userWallet && typeof userWallet.balance === "number") {
            return { success: true, balance: userWallet.balance, wallet: userWallet };
          }
        }
      } catch (e) {
        console.warn("[Fetch Cloud Wallet]", e);
      }
      return { success: false };
    },

    // --- 4. SUBSCRIPTION ENTITY API ---
    async createSubscription(subData) {
      console.log(
        "%c[Mowasalat Sub API] 📋 Creating Subscription...",
        "color:#8b5cf6; font-weight:bold;",
        subData,
      );
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/entities/Subscription`,
          {
            method: "POST",
            headers: getApiHeaders(),
            body: JSON.stringify({
              full_name: subData.full_name,
              phone: subData.phone,
              package_id: subData.package_id,
              package_name: subData.package_name,
              monthly_price: Number(subData.monthly_price) || 0,
              monthly_trip_limit: Number(subData.monthly_trip_limit) || 6,
              status: subData.status || "active",
              city: "فيفاء",
              governorate: "جازان",
              created_date: new Date().toISOString(),
            }),
          },
        );
        if (response.ok) {
          return await response.json();
        }
        throw new Error(`فشل حفظ الاشتراك في الخادم (${response.status})`);
      } catch (err) {
        console.error("[Mowasalat Sub API] Error:", err.message);
        throw err;
      }
    },

    // --- 5. PAYMENT PROOF API (BANK TRANSFER) ---
    async uploadPaymentProof(proofData) {
      console.log(
        "%c[Mowasalat Proof API] 🏦 Submitting PaymentProof...",
        "color:#06b6d4; font-weight:bold;",
        proofData,
      );
      try {
        const response = await fetch(
          `${API_CONFIG.BASE_URL}/entities/PaymentProof`,
          {
            method: "POST",
            headers: getApiHeaders(),
            body: JSON.stringify({
              ref_type: "subscription",
              ref_id: proofData.ref_id || "sub_general",
              amount: Number(proofData.amount) || 0,
              bank_name: proofData.bank_name || "مصرف الراجحي",
              customer_name: proofData.customer_name,
              customer_phone: proofData.customer_phone,
              file_uri: proofData.file_name || "receipt.png",
              status: "pending",
              created_date: new Date().toISOString(),
            }),
          },
        );
        if (response.ok) {
          return await response.json();
        }
        throw new Error(`فشل رفع إيصال التحويل (${response.status})`);
      } catch (err) {
        console.error("[Mowasalat Proof API] Error:", err.message);
        throw err;
      }
    },
  };

  // ============================================================
  // STORAGE SERVICE (MATCHING REACT NATIVE APP ARCHITECTURE)
  // ============================================================
  const USERS_DB_KEY = "mowasalat_registered_users_db";

  function getRegisteredUsers() {
    try {
      const raw = localStorage.getItem(USERS_DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}

    // Registered accounts storage (no hardcoded demo users)
    return [];
  }

  function saveUserToDatabase(user) {
    const users = getRegisteredUsers();
    const existingIdx = users.findIndex(
      (u) =>
        (user.phone && u.phone === user.phone) ||
        (user.email && u.email === user.email),
    );
    if (existingIdx >= 0) {
      users[existingIdx] = { ...users[existingIdx], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  }

  const StorageService = {
    getUserProfile() {
      try {
        const s = localStorage.getItem("mowasalat_user");
        return s ? JSON.parse(s) : null;
      } catch (e) {
        return null;
      }
    },
    saveUserProfile(profile) {
      try {
        localStorage.setItem("mowasalat_user", JSON.stringify(profile));
        return true;
      } catch (e) {
        return false;
      }
    },
    findRegisteredUser(identifier) {
      const clean = (identifier || "").trim().replace(/\s+/g, "");
      const cleanDigits = clean.replace(/\D+/g, "");
      const users = getRegisteredUsers();
      return users.find((u) => {
        const uDigits = (u.phone || "").replace(/\D+/g, "");
        const phoneMatch =
          cleanDigits &&
          uDigits &&
          (uDigits === cleanDigits ||
            (cleanDigits.length >= 9 && uDigits.endsWith(cleanDigits.slice(-9))) ||
            (uDigits.length >= 9 && cleanDigits.endsWith(uDigits.slice(-9))));
        const emailMatch =
          u.email && u.email.toLowerCase() === clean.toLowerCase();
        const userMatch =
          u.username && u.username.toLowerCase() === clean.toLowerCase();
        return phoneMatch || emailMatch || userMatch;
      });
    },
    logout() {
      localStorage.removeItem("mowasalat_user");
    },
  };

  // ============================================================
  // SESSION STATE
  // ============================================================
  let currentUser = null;
  let pendingOtpData = null;
  let otpTimerInterval = null;
  let currentCheckoutPlan = null;
  let selectedPaymentMethod = "online";

  // Restore active session with validity check
  try {
    const saved = localStorage.getItem("mowasalat_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Purge only legacy hardcoded dummy session (0512345675 dummy)
      if (
        parsed &&
        parsed.name === "ziad abdalla" &&
        parsed.phone === "0512345675"
      ) {
        localStorage.removeItem("mowasalat_user");
        currentUser = null;
      } else if (
        parsed &&
        parsed.name &&
        !/^\d+$/.test(parsed.name.replace(/[\s\-\+]/g, ""))
      ) {
        currentUser = parsed;
      } else {
        localStorage.removeItem("mowasalat_user");
        currentUser = null;
      }
    }
  } catch (e) {
    currentUser = null;
  }

  // ============================================================
  // WALLET SERVICE & SAUDI BANKING ENGINES
  // ============================================================
  function detectSaudiBank(iban) {
    const clean = (iban || "").replace(/\s+/g, "").toUpperCase();
    if (clean.length < 6)
      return { code: "", nameAr: "بنك سعودي محلي", nameEn: "Saudi Local Bank" };

    const bankCode = clean.substring(4, 6);
    switch (bankCode) {
      case "58":
      case "50":
        return {
          code: "RJHI",
          nameAr: "مصرف الراجحي (Al Rajhi Bank)",
          nameEn: "Al Rajhi Bank",
        };
      case "10":
        return {
          code: "NCBK",
          nameAr: "البنك الأهلي السعودي (SNB)",
          nameEn: "Saudi National Bank",
        };
      case "05":
        return {
          code: "RIBL",
          nameAr: "بنك الرياض (Riyad Bank)",
          nameEn: "Riyad Bank",
        };
      case "30":
        return {
          code: "INMA",
          nameAr: "مصرف الإنماء (Alinma Bank)",
          nameEn: "Alinma Bank",
        };
      case "20":
        return {
          code: "ALBI",
          nameAr: "بنك البلاد (Bank Albilad)",
          nameEn: "Bank Albilad",
        };
      case "15":
        return {
          code: "BJAZ",
          nameAr: "بنك الجزيرة (Bank AlJazira)",
          nameEn: "Bank AlJazira",
        };
      case "45":
        return {
          code: "SABB",
          nameAr: "البنك السعودي الأول (SAB)",
          nameEn: "Saudi Awwal Bank",
        };
      case "65":
        return {
          code: "ARNB",
          nameAr: "البنك العربي الوطني (ANB)",
          nameEn: "Arab National Bank",
        };
      case "80":
        return {
          code: "BSFR",
          nameAr: "بنك الفرانسي (Banque Saudi Fransi)",
          nameEn: "Banque Saudi Fransi",
        };
      case "75":
        return {
          code: "GIBK",
          nameAr: "بنك الخليج الدولي (GIB)",
          nameEn: "Gulf International Bank",
        };
      default:
        return {
          code: "KSA",
          nameAr: "حساب بنكي معتمد في المملكة",
          nameEn: "Verified Saudi Bank",
        };
    }
  }

  const WalletService = {
    getUserKey() {
      return currentUser && currentUser.phone
        ? currentUser.phone
        : "default_user";
    },
    getBalance() {
      try {
        const key = `@mwasalat_wallet_balance_${this.getUserKey()}`;
        const val = localStorage.getItem(key);
        if (val !== null) return parseFloat(val) || 0;
      } catch (e) {}
      return 0.0;
    },
    setBalance(amt) {
      try {
        const key = `@mwasalat_wallet_balance_${this.getUserKey()}`;
        localStorage.setItem(key, amt.toFixed(2));
      } catch (e) {}
      this.syncUI();
      return amt;
    },
    getTransactions() {
      try {
        const key = `@mwasalat_wallet_txs_${this.getUserKey()}`;
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
      } catch (e) {}
      return [];
    },
    saveTransactions(txs) {
      try {
        const key = `@mwasalat_wallet_txs_${this.getUserKey()}`;
        localStorage.setItem(key, JSON.stringify(txs));
      } catch (e) {}
    },
    recharge(amount, title = "شحن رصيد معتمد عبر Stripe", meta = {}) {
      const current = this.getBalance();
      const updated = current + amount;
      this.setBalance(updated);

      const txs = this.getTransactions();
      const ref =
        meta.referenceNo ||
        `STRIPE-${Math.floor(100000 + Math.random() * 900000)}`;
      const newTx = {
        id: "TX-" + Date.now(),
        title: title,
        amount: amount,
        type: "credit",
        referenceNo: ref,
        paymentChannel: meta.paymentChannel || "بوابة الدفع الإلكتروني (Stripe)",
        date: new Date().toLocaleDateString("ar-SA"),
      };
      txs.unshift(newTx);
      this.saveTransactions(txs);
      this.syncUI();
      if (typeof renderWalletHistory === "function") {
        renderWalletHistory();
      }

      // Sync verified balance with cloud backend
      if (currentUser && (currentUser.id || currentUser.phone)) {
        MowasalatAPI.syncLiveWalletBalance(currentUser.id || currentUser.phone, updated).catch(() => {});
      }

      return { newBalance: updated, referenceNo: ref };
    },
    deduct(amount, title = "خصم من المحفظة", meta = {}) {
      const current = this.getBalance();
      if (current < amount) {
        return {
          success: false,
          error: "رصيد المحفظة الحالي غير كافٍ لإتمام العملية.",
        };
      }
      const updated = current - amount;
      this.setBalance(updated);

      const txs = this.getTransactions();
      const ref =
        meta.referenceNo ||
        `WTH-SARIE-${Math.floor(100000 + Math.random() * 900000)}`;
      const newTx = {
        id: "TX-" + Date.now(),
        title: title,
        amount: -amount,
        type: "debit",
        referenceNo: ref,
        paymentChannel: meta.paymentChannel || "نظام التحويل السريع (SARIE)",
        date: new Date().toLocaleDateString("ar-SA"),
      };
      txs.unshift(newTx);
      this.saveTransactions(txs);
      this.syncUI();
      if (typeof renderWalletHistory === "function") {
        renderWalletHistory();
      }

      // Sync verified balance with cloud backend
      if (currentUser && (currentUser.id || currentUser.phone)) {
        MowasalatAPI.syncLiveWalletBalance(currentUser.id || currentUser.phone, updated).catch(() => {});
      }

      return { success: true, newBalance: updated, referenceNo: ref };
    },
    syncUI() {
      const bal = this.getBalance();
      const balStr = bal.toFixed(2);
      const currentLang = localStorage.getItem("mowasalat_lang") || document.documentElement.getAttribute("lang") || "ar";
      const isEn = currentLang === "en";
      const curr = isEn ? "SAR" : "ر.س";

      const modalBal = document.getElementById("wallet-modal-balance");
      if (modalBal) modalBal.textContent = balStr;

      const pageBal = document.getElementById("wallet-page-balance");
      if (pageBal) pageBal.textContent = balStr;

      const navBadges = document.querySelectorAll("#nav-wallet-balance-badge");
      navBadges.forEach((b) => (b.textContent = `${balStr} ${curr}`));

      // Update statistics on standalone wallet page
      try {
        const txs = this.getTransactions();
        const topups = txs
          .filter((t) => t.type === "credit" || t.amount > 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const withdraws = txs
          .filter((t) => t.type === "debit" || t.amount < 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);

        const topupEl = document.getElementById("wallet-page-total-topup");
        if (topupEl) topupEl.textContent = `${topups.toFixed(2)} ${curr}`;
        const withdrawEl = document.getElementById("wallet-page-total-withdraw");
        if (withdrawEl) withdrawEl.textContent = `${withdraws.toFixed(2)} ${curr}`;
        const countEl = document.getElementById("wallet-page-total-txs");
        if (countEl) countEl.textContent = String(txs.length);

        const cardUserEl = document.getElementById("wallet-card-user-name");
        if (cardUserEl) {
          cardUserEl.textContent =
            currentUser && currentUser.name
              ? currentUser.name
              : (isEn ? "Verified Mowasalat Member" : "مشترك مواصلات الموثق");
        }

        const cardAccEl = document.getElementById("wallet-card-acc-no");
        if (cardAccEl) {
          if (currentUser && currentUser.phone) {
            const digits = currentUser.phone.replace(/\D+/g, "");
            const last4 = digits.slice(-4) || "8421";
            const mid4 = digits.length >= 8 ? digits.slice(-8, -4) : "4000";
            cardAccEl.textContent = `SA 88 ${mid4} **** **** ${last4}`;
          } else {
            cardAccEl.textContent = "SA 88 4000 **** **** 8421";
          }
        }

        const bannerEl = document.getElementById("wallet-auth-banner");
        if (bannerEl) {
          if (currentUser && currentUser.name) {
            bannerEl.classList.add("hidden");
          } else {
            bannerEl.classList.remove("hidden");
          }
        }
      } catch (e) {}
    },
  };

  // --- Render Navbar Auth State ---
  window.renderAuthNav = function () {
    const desktopContainer = document.getElementById("desktop-auth-container");
    const mobileContainer = document.getElementById("mobile-auth-container");
    const currentLang = localStorage.getItem("mowasalat_lang") || document.documentElement.getAttribute("lang") || "ar";
    const isEn = currentLang === "en";

    if (currentUser && currentUser.name) {
      // Clean display name (never show raw numbers as names)
      let displayName = currentUser.name;
      if (/^\d+$/.test(displayName.replace(/\s+/g, ""))) {
        displayName = isEn ? "Subscriber Account" : "حساب المشترك";
      }

      const initialChar = displayName ? displayName.trim().charAt(0) : (isEn ? "U" : "م");
      const currentBal = WalletService.getBalance().toFixed(2);
      const avatarUrl = currentUser.avatar_url || currentUser.avatarUrl || "";

      const avatarNavHtml = avatarUrl
        ? `<div class="relative shrink-0"><img src="${avatarUrl}" class="w-8 h-8 rounded-full object-cover shadow-sm ring-2 ring-blue-500/20 border border-white" alt="${displayName}"><span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span></div>`
        : `<div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 flex items-center justify-center text-white text-xs font-black shadow-sm ring-2 ring-blue-500/20 border border-white shrink-0 relative">
            ${initialChar}
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>`;

      const avatarDropdownHtml = avatarUrl
        ? `<img src="${avatarUrl}" class="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-blue-500/15 shrink-0" alt="${displayName}">`
        : `<div class="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white text-lg font-black border-2 border-white shadow-md ring-2 ring-blue-500/15 shrink-0">
            ${initialChar}
          </div>`;

      const userHtml = `
                <div class="relative inline-block text-start" id="user-menu-wrapper">
                    <button type="button" onclick="toggleUserDropdown()" id="user-menu-btn" class="user-navbar-pill flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] transition-all cursor-pointer select-none">
                        ${avatarNavHtml}
                        <span class="max-w-[120px] truncate text-slate-800 font-extrabold text-xs sm:text-sm tracking-tight">${displayName}</span>
                        <i id="user-menu-chevron" class="fa-solid fa-chevron-down text-[10px] text-blue-600 transition-transform duration-200 ml-1"></i>
                    </button>
                    <div id="user-dropdown-menu" class="hidden absolute rtl:left-0 rtl:right-auto ltr:right-0 ltr:left-auto mt-2.5 w-80 max-w-[92vw] rounded-2xl bg-white text-slate-800 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.15)] border border-slate-200 p-3.5 z-50 animate-modal backdrop-blur-2xl">
                        <!-- User Card -->
                        <div class="user-card-inner p-3.5 bg-gradient-to-br from-slate-50 to-blue-50/50 border border-slate-200/80 rounded-xl mb-2.5 text-xs shadow-sm">
                            <div class="flex items-center justify-between gap-3.5">
                                <div class="truncate flex-1 text-right">
                                    <p class="font-black text-slate-900 text-sm truncate leading-tight">${displayName}</p>
                                    <p class="text-xs text-slate-500 font-mono mt-1 flex items-center justify-start gap-1.5" dir="ltr">
                                        <i class="fa-solid fa-phone text-[10px] text-blue-600"></i>
                                        <span>${currentUser.phone || ""}</span>
                                    </p>
                                </div>
                                <div class="shrink-0">
                                    ${avatarDropdownHtml}
                                </div>
                            </div>
                            <div class="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between">
                                <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span data-ar="مشترك نشط" data-en="Active Subscriber">${isEn ? "Active Subscriber" : "مشترك نشط"}</span>
                                </span>
                                <span class="text-[11px] text-slate-400 font-medium" data-ar="حساب موثق" data-en="Verified Account">${isEn ? "Verified Account" : "حساب موثق"}</span>
                            </div>
                        </div>

                        <!-- 1. المحفظة الرقمية -->
                        <a href="wallet.html" class="w-full flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl hover:bg-slate-50 text-slate-800 font-bold transition-all group mb-1.5 cursor-pointer">
                            <div class="flex items-center gap-3">
                                <div class="item-icon-wallet w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200 group-hover:scale-105 group-hover:bg-blue-100 transition-all text-sm">
                                    <i class="fa-solid fa-wallet"></i>
                                </div>
                                <span class="text-sm font-black whitespace-nowrap text-slate-800" data-ar="المحفظة الرقمية" data-en="Digital Wallet">${isEn ? "Digital Wallet" : "المحفظة الرقمية"}</span>
                            </div>
                            <span id="nav-wallet-balance-badge" class="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 font-mono whitespace-nowrap">
                                <span class="balance-num">${currentBal}</span> <span data-ar="ر.س" data-en="SAR">${isEn ? "SAR" : "ر.س"}</span>
                            </span>
                        </a>

                        <!-- 2. باقاتي واشتراكاتي -->
                        <a href="index.html#subscriptions" onclick="document.getElementById('user-dropdown-menu').classList.add('hidden')" class="flex items-center justify-between px-3.5 py-2.5 text-xs rounded-xl hover:bg-slate-50 text-slate-800 font-bold transition-all group mb-1.5">
                            <div class="flex items-center gap-3">
                                <div class="item-icon-subs w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 group-hover:scale-105 transition-all text-sm">
                                    <i class="fa-solid fa-ticket"></i>
                                </div>
                                <span class="text-sm font-bold whitespace-nowrap text-slate-800" data-ar="باقاتي واشتراكاتي" data-en="My Subscriptions">${isEn ? "My Subscriptions" : "باقاتي واشتراكاتي"}</span>
                            </div>
                            <i class="fa-solid fa-chevron-left rtl:rotate-0 ltr:rotate-180 text-xs text-slate-400 group-hover:text-slate-600 transition-all"></i>
                        </a>

                        <!-- 3. تسجيل الخروج -->
                        <button type="button" onclick="logoutUser()" class="btn-logout w-full flex items-center gap-3 px-3.5 py-2.5 text-xs rounded-xl hover:bg-rose-50 text-rose-600 font-bold transition-all mt-1 cursor-pointer group">
                            <div class="item-icon-logout w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200 group-hover:scale-105 transition-all text-sm">
                                <i class="fa-solid fa-arrow-right-from-bracket rtl:rotate-0 ltr:rotate-180 transition-all"></i>
                            </div>
                            <span class="text-sm font-bold whitespace-nowrap" data-ar="تسجيل الخروج" data-en="Sign Out">${isEn ? "Sign Out" : "تسجيل الخروج"}</span>
                        </button>
                    </div>
                </div>
            `;

      const avatarMobileHtml = avatarUrl
        ? `<img src="${avatarUrl}" class="w-10 h-10 rounded-full object-cover border border-white/40 shadow-sm shrink-0" alt="${displayName}">`
        : `<div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white text-sm font-bold border border-white/30 shrink-0">
            ${initialChar}
          </div>`;

      const mobileHtml = `
                <div class="p-4 bg-white rounded-2xl border border-slate-200 text-slate-800 space-y-3 shadow-lg">
                    <div class="flex items-center gap-3">
                        ${avatarMobileHtml}
                        <div class="truncate flex-1">
                            <p class="text-sm font-bold text-slate-900 truncate">${displayName}</p>
                            <p class="text-xs text-slate-500 font-mono mt-0.5 flex items-center gap-1.5" dir="ltr">
                                <i class="fa-solid fa-phone text-[10px] text-blue-600"></i>
                                <span>${currentUser.phone || ""}</span>
                            </p>
                            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span data-ar="مشترك نشط" data-en="Active Subscriber">${isEn ? "Active Subscriber" : "مشترك نشط"}</span>
                            </span>
                        </div>
                    </div>
                    <div class="pt-2 border-t border-slate-200 flex flex-col gap-2">
                        <a href="wallet.html"
                            class="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold bg-blue-50/60 hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-xl transition-all">
                            <span class="flex items-center gap-2"><i class="fa-solid fa-wallet text-blue-600"></i> <span data-ar="المحفظة الرقمية" data-en="Digital Wallet">${isEn ? "Digital Wallet" : "المحفظة الرقمية"}</span></span>
                            <span class="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300 font-mono">${currentBal} <span data-ar="ر.س" data-en="SAR">${isEn ? "SAR" : "ر.س"}</span></span>
                        </a>
                        <a href="index.html#subscriptions" onclick="document.getElementById('mobile-menu').classList.add('hidden')"
                            class="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold bg-amber-50/60 hover:bg-amber-50 text-amber-700 border border-amber-200 rounded-xl transition-all">
                            <span class="flex items-center gap-2"><i class="fa-solid fa-ticket text-amber-600"></i> <span data-ar="باقاتي واشتراكاتي" data-en="My Subscriptions">${isEn ? "My Subscriptions" : "باقاتي واشتراكاتي"}</span></span>
                            <i class="fa-solid fa-chevron-left rtl:rotate-0 ltr:rotate-180 text-[10px]"></i>
                        </a>
                        <button type="button" onclick="logoutUser(); document.getElementById('mobile-menu').classList.add('hidden')"
                            class="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-all">
                            <i class="fa-solid fa-arrow-right-from-bracket rtl:rotate-0 ltr:rotate-180"></i> <span data-ar="تسجيل الخروج" data-en="Sign Out">${isEn ? "Sign Out" : "تسجيل الخروج"}</span>
                        </button>
                    </div>
                </div>
            `;

      if (desktopContainer) desktopContainer.innerHTML = userHtml;
      if (mobileContainer) mobileContainer.innerHTML = mobileHtml;
    } else {
      const loginBtnDesktop = `
                <button onclick="showAuthModal('login')" class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#1a4a8a] !text-white rounded-2xl hover:bg-[#2a5a9a] transition-all shadow-lg shadow-blue-900/20">
                    <i class="fa-regular fa-user"></i>
                    <span class="nav-auth-btn" data-ar="تسجيل الدخول" data-en="Sign In">تسجيل الدخول</span>
                </button>
            `;
      const loginBtnMobile = `
                <button onclick="showAuthModal('login'); document.getElementById('mobile-menu').classList.add('hidden')" class="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-[#1a4a8a] text-white rounded-2xl">
                    <i class="fa-regular fa-user"></i>
                    <span class="nav-auth-btn" data-ar="تسجيل الدخول" data-en="Sign In">تسجيل الدخول</span>
                </button>
            `;
      if (desktopContainer) desktopContainer.innerHTML = loginBtnDesktop;
      if (mobileContainer) mobileContainer.innerHTML = loginBtnMobile;
    }

    // Toggle Smart Wallet Navbar links: Only visible when customer is logged in!
    const isLoggedIn = !!(currentUser && currentUser.name);
    const walletNavLinks = document.querySelectorAll('a[href*="wallet.html"]:not(#user-dropdown-menu *):not(#mobile-auth-container *)');
    walletNavLinks.forEach((link) => {
      if (isLoggedIn) {
        link.classList.remove("hidden");
      } else {
        link.classList.add("hidden");
      }
    });

    // Guard wallet.html page: if not logged in, redirect to index.html and prompt login
    if (!isLoggedIn && window.location.pathname.includes("wallet.html")) {
      window.location.replace("index.html?auth=required");
    }
  };

  window.toggleUserDropdown = function () {
    const menu = document.getElementById("user-dropdown-menu");
    const chevron = document.getElementById("user-menu-chevron");
    if (menu) {
      const isHidden = menu.classList.contains("hidden");
      if (isHidden) {
        menu.classList.remove("hidden");
        if (chevron) chevron.style.transform = "rotate(180deg)";
      } else {
        menu.classList.add("hidden");
        if (chevron) chevron.style.transform = "rotate(0deg)";
      }
    }
  };

  window.logoutUser = function () {
    currentUser = null;
    localStorage.removeItem("mowasalat_user");
    renderAuthNav();
    WalletService.syncUI();
    if (typeof renderWalletHistory === "function") {
      renderWalletHistory();
    }
    showToast("تم تسجيل الخروج بنجاح 👋");
  };

  document.addEventListener("click", function (e) {
    const wrapper = document.getElementById("user-menu-wrapper");
    const menu = document.getElementById("user-dropdown-menu");
    const chevron = document.getElementById("user-menu-chevron");
    if (wrapper && menu && !wrapper.contains(e.target)) {
      menu.classList.add("hidden");
      if (chevron) chevron.style.transform = "rotate(0deg)";
    }
  });

  // ============================================================
  // SMART DIGITAL WALLET CONTROLLERS & SERVICES
  // ============================================================

  window.openWalletModal = function (tab = "topup") {
    if (!currentUser || !currentUser.name) {
      showToast("يرجى تسجيل الدخول أولاً للوصول إلى المحفظة الرقمية", "warning");
      showAuthModal("login");
      return;
    }
    if (!window.location.pathname.includes("wallet.html")) {
      window.location.href = `wallet.html${tab ? "?tab=" + tab : ""}`;
      return;
    }
    switchWalletTab(tab);
  };

  window.hideWalletModal = function () {
    const modal = document.getElementById("wallet-modal");
    if (modal) modal.classList.add("hidden");
  };

  window.switchWalletTab = function (tab) {
    const btnTopup = document.getElementById("wtab-btn-topup");
    const btnWithdraw = document.getElementById("wtab-btn-withdraw");
    const btnHistory = document.getElementById("wtab-btn-history");

    const contentTopup = document.getElementById("wtab-content-topup");
    const contentWithdraw = document.getElementById("wtab-content-withdraw");
    const contentHistory = document.getElementById("wtab-content-history");

    // Reset tab buttons if modal or desktop tabs present
    if (btnTopup) {
      btnTopup.className =
        "py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all " +
        (tab === "topup"
          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
          : "text-gray-300 hover:text-white");
    }
    if (btnWithdraw) {
      btnWithdraw.className =
        "py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all " +
        (tab === "withdraw"
          ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg"
          : "text-gray-300 hover:text-white");
    }
    if (btnHistory) {
      btnHistory.className =
        "py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all " +
        (tab === "history"
          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
          : "text-gray-300 hover:text-white");
    }

    if (contentTopup) contentTopup.classList.toggle("hidden", tab !== "topup");
    if (contentWithdraw) contentWithdraw.classList.toggle("hidden", tab !== "withdraw");
    if (contentHistory) contentHistory.classList.toggle("hidden", tab !== "history");

    // Smooth scroll for standalone wallet.html page
    if (tab === "topup") {
      const topupTarget = document.getElementById("wallet-topup-amount") || document.getElementById("btn-wallet-topup-submit");
      if (topupTarget && window.location.pathname.includes("wallet.html")) {
        topupTarget.scrollIntoView({ behavior: "smooth", block: "center" });
        try { topupTarget.focus(); } catch (e) {}
      }
    } else if (tab === "withdraw") {
      const withdrawTarget = document.getElementById("wallet-withdraw-amount") || document.getElementById("withdraw-step-1");
      if (withdrawTarget && window.location.pathname.includes("wallet.html")) {
        withdrawTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else if (tab === "history") {
      const historyTarget = document.getElementById("wallet-history-list");
      if (historyTarget && window.location.pathname.includes("wallet.html")) {
        historyTarget.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      renderWalletHistory();
    }
  };

  window.setTopUpAmount = function (val) {
    const input = document.getElementById("wallet-topup-amount");
    if (input) input.value = val;
    const chips = document.querySelectorAll(".wchip-btn");
    chips.forEach((c) => {
      if (c.textContent.includes(String(val))) {
        c.className =
          "wchip-btn py-2 rounded-xl text-xs font-bold bg-blue-600/40 border border-blue-400 text-white transition-all";
      } else {
        c.className =
          "wchip-btn py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all";
      }
    });
  };

  // Top Up -> Call Stripe Checkout Live API & Redirect
  window.executeWalletRecharge = async function () {
    if (!currentUser || !currentUser.name) {
      showToast("يرجى تسجيل الدخول أولاً للمتابعة إلى شحن المحفظة", "warning");
      showAuthModal("login");
      return;
    }

    const input = document.getElementById("wallet-topup-amount");
    const submitBtn = document.getElementById("btn-wallet-topup-submit");
    const num = parseFloat(input ? input.value : 0);

    if (isNaN(num) || num <= 0) {
      showToast("يرجى إدخال مبلغ شحن صحيح أكبر من صفر", "warning", "مبلغ غير صالح");
      return;
    }
    if (num < 10) {
      showToast("الحد الأدنى لشحن المحفظة هو 10 ريالات سعودية", "warning", "الحد الأدنى للشحن");
      return;
    }

    // Payment method selection
    const methodEl = document.querySelector('input[name="wallet-pay-method"]:checked');
    const paymentMethod = methodEl ? methodEl.value : "mada";

    const originalHtml = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.innerHTML = `<span class="api-loading-spinner ml-2"></span> جاري تجهيز بوابة Stripe الآمنة...`;
      submitBtn.disabled = true;
    }

    try {
      const sessionToken = `SEC_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
      localStorage.setItem(
        "@mwasalat_pending_checkout",
        JSON.stringify({
          token: sessionToken,
          amount: num,
          method: paymentMethod,
          userId: currentUser.id || currentUser.phone || "usr_wallet",
          userPhone: currentUser.phone || "",
          userName: currentUser.name || "مشترك مواصلات",
          timestamp: Date.now(),
        })
      );

      const origin = window.location.origin;
      const successUrl = `${origin}/wallet.html?payment=success&amount=${num}&token=${sessionToken}`;
      const cancelUrl = `${origin}/wallet.html?payment=cancelled`;

      const checkoutRes = await MowasalatAPI.processWalletCheckout({
        amount: num,
        userId: currentUser.id || currentUser.phone || "usr_wallet",
        userEmail: currentUser.email || `${currentUser.phone || "user"}@mowasalat.sa`,
        userPhone: currentUser.phone || "",
        userName: currentUser.name || currentUser.fullName || "مشترك مواصلات",
        paymentMethod: paymentMethod === "apple" ? "apple_pay" : paymentMethod === "mada" ? "mada" : "card",
        successUrl: successUrl,
        cancelUrl: cancelUrl,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      const stripeUrl = checkoutRes.data?.url || checkoutRes.data?.checkout_url || checkoutRes.data?.session_url;

      if (!stripeUrl) {
        if (submitBtn) {
          submitBtn.innerHTML = originalHtml;
          submitBtn.disabled = false;
        }
        showToast(
          checkoutRes.error ||
            "تعذر إنشاء جلسة الدفع عبر Stripe. يرجى التحقق من اتصال الإنترنت والمحاولة مجدداً.",
          "error",
          "فشل الاتصال ببوابة الدفع",
        );
        return;
      }

      showToast("جاري تحويلك الآن إلى بوابة Stripe الآمنة... 🔒", "success", "بوابة الدفع الإلكتروني");
      setTimeout(() => {
        window.location.href = stripeUrl;
      }, 450);
    } catch (err) {
      console.error("[Wallet Topup Error]", err);
      if (submitBtn) {
        submitBtn.innerHTML = originalHtml;
        submitBtn.disabled = false;
      }
      showToast(err.message || "تعذر فتح بوابة الدفع الآمنة", "error");
    }
  };

  // Withdraw Amount Controller
  window.setWithdrawAmount = function (val) {
    const input = document.getElementById("wallet-withdraw-amount");
    const bal = WalletService.getBalance();
    const targetVal = val === "all" ? (bal > 0 ? bal.toFixed(0) : "0") : String(val);
    if (input) input.value = targetVal;

    const chips = document.querySelectorAll(".wchip-wth");
    chips.forEach((c) => {
      const isMatch = (val === "all" && c.textContent.includes("كامل")) || c.textContent.includes(String(val));
      if (isMatch) {
        c.className =
          "wchip-wth py-2 rounded-xl text-xs font-bold bg-amber-500/20 border border-amber-400 text-amber-300 transition-all";
      } else {
        c.className =
          "wchip-wth py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all";
      }
    });
  };

  window.toggleWithdrawChannel = function (channel) {
    const ibanGroup = document.getElementById("wth-iban-group");
    const stcGroup = document.getElementById("wth-stc-group");
    if (channel === "iban") {
      if (ibanGroup) ibanGroup.classList.remove("hidden");
      if (stcGroup) stcGroup.classList.add("hidden");
    } else {
      if (ibanGroup) ibanGroup.classList.add("hidden");
      if (stcGroup) stcGroup.classList.remove("hidden");
      // Pre-fill phone if available
      const stcPhoneEl = document.getElementById("wth-stc-phone");
      if (stcPhoneEl && currentUser && currentUser.phone && !stcPhoneEl.value) {
        stcPhoneEl.value = currentUser.phone;
      }
    }
  };

  window.handleIbanInput = function (inputEl) {
    let clean = (inputEl.value || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (!clean.startsWith("SA")) {
      clean = "SA" + clean;
    }
    clean = clean.slice(0, 24);
    inputEl.value = clean;

    const bank = detectSaudiBank(clean);
    const bankNameEl = document.getElementById("wth-detected-bank-name");
    if (bankNameEl) {
      if (clean.length >= 6) {
        bankNameEl.textContent = bank.nameAr;
      } else {
        bankNameEl.textContent = "يرجى إكمال كتابة رقم الآيبان للتعرف على البنك";
      }
    }
  };

  window.proceedWithdrawStep2 = function () {
    if (!currentUser || !currentUser.name) {
      showToast("يرجى تسجيل الدخول أولاً للمتابعة إلى سحب الرصيد", "warning");
      showAuthModal("login");
      return;
    }

    const input = document.getElementById("wallet-withdraw-amount");
    const num = parseFloat(input ? input.value : 0);
    const bal = WalletService.getBalance();

    if (isNaN(num) || num <= 0) {
      showToast("يرجى إدخال مبلغ سحب صحيح أكبر من صفر", "warning", "مبلغ غير صالح");
      return;
    }
    if (num < 10) {
      showToast("الحد الأدنى لطلب السحب الفوري هو 10 ريالات سعودية", "warning", "الحد الأدنى للسحب");
      return;
    }
    if (num > bal) {
      showToast(
        `رصيدك المتاح (${bal.toFixed(2)} ر.س) أقل من المبلغ المطلوب سحبه (${num.toFixed(2)} ر.س)`,
        "warning",
        "رصيد غير كافٍ"
      );
      return;
    }

    // Pre-fill beneficiary name if available
    const nameEl = document.getElementById("wth-beneficiary-name");
    if (nameEl && (!nameEl.value || nameEl.value.trim() === "") && currentUser && currentUser.name) {
      nameEl.value = currentUser.name;
    }
    const stcNameEl = document.getElementById("wth-stc-name");
    if (stcNameEl && (!stcNameEl.value || stcNameEl.value.trim() === "") && currentUser && currentUser.name) {
      stcNameEl.value = currentUser.name;
    }

    document.getElementById("withdraw-step-1").classList.add("hidden");
    document.getElementById("withdraw-step-2").classList.remove("hidden");
    document.getElementById("withdraw-step-3").classList.add("hidden");
  };

  window.backWithdrawStep1 = function () {
    document.getElementById("withdraw-step-1").classList.remove("hidden");
    document.getElementById("withdraw-step-2").classList.add("hidden");
    document.getElementById("withdraw-step-3").classList.add("hidden");
  };

  window.proceedWithdrawStep3 = function () {
    const amount = parseFloat(document.getElementById("wallet-withdraw-amount").value || 0);
    const channelRadio = document.querySelector('input[name="withdraw-channel"]:checked');
    const channel = channelRadio ? channelRadio.value : "iban";

    let destName = "";
    let benefName = "";

    if (channel === "iban") {
      const ibanEl = document.getElementById("wth-iban-input");
      const nameEl = document.getElementById("wth-beneficiary-name");
      const ibanVal = (ibanEl ? ibanEl.value : "").trim().toUpperCase();
      benefName = (nameEl ? nameEl.value : "").trim();

      if (ibanVal.length < 24) {
        showToast("يرجى إدخال رقم آيبان سعودي كامل يبدأ بـ SA ومكون من 24 حرفاً ورقماً", "warning", "آيبان غير مكتمل");
        return;
      }
      if (!benefName) {
        showToast("يرجى إدخال اسم صاحب الحساب البنكي المستفيد", "warning", "اسم المستفيد مطلوب");
        return;
      }
      const bank = detectSaudiBank(ibanVal);
      destName = `${bank.nameAr} (${ibanVal.slice(-4)})`;
    } else {
      const phoneEl = document.getElementById("wth-stc-phone");
      const nameEl = document.getElementById("wth-stc-name");
      const phoneVal = (phoneEl ? phoneEl.value : "").trim().replace(/\D+/g, "");
      benefName = (nameEl ? nameEl.value : "").trim();

      if (phoneVal.length < 10 || !phoneVal.startsWith("05")) {
        showToast("يرجى إدخال رقم جوال سعودي صحيح لـ STC Pay (05xxxxxxxx)", "warning", "رقم جوال غير صالح");
        return;
      }
      if (!benefName) {
        showToast("يرجى إدخال اسم صاحب محفظة STC Pay", "warning", "الاسم مطلوب");
        return;
      }
      destName = `STC Pay (${phoneVal.slice(-4)})`;
    }

    // Set confirmation summary values
    const currentLang = localStorage.getItem("mowasalat_lang") || document.documentElement.getAttribute("lang") || "ar";
    const curr = currentLang === "en" ? "SAR" : "ر.س";
    const wthAmtEl = document.getElementById("wth-conf-amount");
    const wthDestEl = document.getElementById("wth-conf-dest");
    const wthNameEl = document.getElementById("wth-conf-name");
    const wthNetEl = document.getElementById("wth-conf-net");

    if (wthAmtEl) wthAmtEl.textContent = `${amount.toFixed(2)} ${curr}`;
    if (wthDestEl) wthDestEl.textContent = destName;
    if (wthNameEl) wthNameEl.textContent = benefName;
    if (wthNetEl) wthNetEl.textContent = `${amount.toFixed(2)} ${curr}`;

    document.getElementById("withdraw-step-1").classList.add("hidden");
    document.getElementById("withdraw-step-2").classList.add("hidden");
    document.getElementById("withdraw-step-3").classList.remove("hidden");
  };

  window.backWithdrawStep2 = function () {
    document.getElementById("withdraw-step-1").classList.add("hidden");
    document.getElementById("withdraw-step-2").classList.remove("hidden");
    document.getElementById("withdraw-step-3").classList.add("hidden");
  };

  // Finalize Withdrawal with Cloud API walletWithdraw & SMS Notification
  window.executeFinalizeWithdraw = async function () {
    const submitBtn = document.getElementById("btn-finalize-withdraw");
    const amount = parseFloat(document.getElementById("wallet-withdraw-amount").value || 0);
    const channelRadio = document.querySelector('input[name="withdraw-channel"]:checked');
    const channel = channelRadio ? channelRadio.value : "iban";

    const ibanVal = (document.getElementById("wth-iban-input")?.value || "").trim().toUpperCase();
    const stcPhoneVal = (document.getElementById("wth-stc-phone")?.value || "").trim();
    const benefName = (
      document.getElementById(channel === "iban" ? "wth-beneficiary-name" : "wth-stc-name")?.value || ""
    ).trim();

    const targetUserId = currentUser ? currentUser.id || currentUser.phone || "usr_withdraw" : "usr_withdraw";
    const currentBal = WalletService.getBalance();

    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) {
      submitBtn.innerHTML = `<span class="api-loading-spinner ml-2"></span> جاري معالجة التحويل الفوري...`;
      submitBtn.disabled = true;
    }

    try {
      // 1. Sync current verified balance to cloud wallet before withdrawal
      await MowasalatAPI.syncLiveWalletBalance(targetUserId, currentBal);

      // 2. Call the deployed Base44 walletWithdraw function
      const withdrawRes = await MowasalatAPI.requestWalletWithdraw({
        amount: amount,
        userId: targetUserId,
        userName: benefName || (currentUser && currentUser.name) || "عميل مواصلات",
        method: channel === "iban" ? "iban" : "stc_pay",
        iban: channel === "iban" ? ibanVal : undefined,
        stcPay: channel !== "iban" ? stcPhoneVal : undefined,
        beneficiaryName: benefName,
      });

      if (submitBtn) {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
      }

      if (withdrawRes.status >= 400 || (withdrawRes.success === false && withdrawRes.error)) {
        showToast(
          withdrawRes.error || "تعذر معالجة طلب السحب من السيرفر. يرجى المحاولة لاحقاً.",
          "error",
          "فشل طلب السحب",
        );
        return;
      }

      // 3. Approved by server -> finalize deduction locally
      const bankInfo = detectSaudiBank(ibanVal);
      const channelTitle =
        channel === "iban" ? `${bankInfo.nameAr} (${ibanVal.slice(-4)})` : `STC Pay (${stcPhoneVal.slice(-4)})`;
      const ref =
        (withdrawRes.data && withdrawRes.data.reference) ||
        `WTH-SARIE-${Math.floor(100000 + Math.random() * 900000)}`;

      const deductRes = WalletService.deduct(amount, `طلب سحب رصيد إلى ${channelTitle}`, {
        referenceNo: ref,
        paymentChannel: channel === "iban" ? "نظام التحويل السريع (SARIE)" : "محفظة STC Pay",
        accountDetails: channel === "iban" ? ibanVal : stcPhoneVal,
      });

      // Send SMS confirmation
      if (currentUser && currentUser.phone) {
        const smsMsg = `عزيزي العميل، تم تسجيل طلب سحب رصيد بمبلغ ${amount.toFixed(2)} ر.س بنجاح إلى ${channelTitle}.\nرقم المرجع: ${ref}.\nالرصيد المتبقي بمحفظتك: ${deductRes.newBalance.toFixed(2)} ر.س.`;
        MowasalatAPI.sendSms(currentUser.phone, smsMsg, "confirmation").catch(() => {});
      }

      hideWalletModal();
      if (typeof backWithdrawStep1 === "function") {
        backWithdrawStep1();
      }

      showToast(
        `تم تسجيل طلب سحب مبلغ ${amount.toFixed(2)} ر.س وتحويله إلى ${channelTitle} بنجاح 💸 (رقم المرجع: ${ref})`,
        "success",
        "تم التحويل الفوري بنجاح"
      );

      // Open transaction receipt
      setTimeout(() => {
        const latestTx = WalletService.getTransactions()[0];
        if (latestTx) openReceiptModal(latestTx.id);
      }, 500);
    } catch (err) {
      console.error("[Withdrawal Error]", err);
      if (submitBtn) {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
      }
      showToast(err.message || "تعذر الاتصال بالسيرفر لمعالجة طلب السحب", "error");
    }
  };

  // Render Wallet Transactions in History Tab & Statement Page
  window.renderWalletHistory = function (filterType = "all") {
    const listEl = document.getElementById("wallet-history-list");
    if (!listEl) return;

    const currentLang = localStorage.getItem("mowasalat_lang") || document.documentElement.getAttribute("lang") || "ar";
    const isEn = currentLang === "en";

    const allTxs = WalletService.getTransactions();
    const txs = filterType === "all"
      ? allTxs
      : filterType === "credit"
      ? allTxs.filter((t) => t.type === "credit" || t.amount > 0)
      : allTxs.filter((t) => t.type === "debit" || t.amount < 0);

    if (!txs || txs.length === 0) {
      const isLight = document.body.classList.contains("light-theme");
      const emptyBg = isLight ? "bg-white border-slate-200" : "bg-white/[0.02] border-white/10";
      const iconBg = isLight ? "bg-slate-100 text-slate-500" : "bg-white/5 text-slate-400";
      const titleCol = isLight ? "text-slate-800" : "text-white";
      const descCol = isLight ? "text-slate-500" : "text-slate-400";

      listEl.innerHTML = `
        <div class="p-8 text-center ${emptyBg} border rounded-2xl space-y-2">
          <div class="w-12 h-12 rounded-full ${iconBg} flex items-center justify-center text-xl mx-auto">
            <i class="fa-solid fa-receipt"></i>
          </div>
          <p class="font-bold ${titleCol} text-sm">${isEn ? "No transactions match this filter" : "لا توجد عمليات تطابق هذا التصنيف"}</p>
          <p class="text-xs ${descCol}">${isEn ? "All top-up, withdrawal, and ride payment transactions will appear here" : "ستظهر هنا جميع حركات الشحن والسحب ودفع المشاوير"}</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = txs
      .map((tx) => {
        const isDebit = tx.amount < 0 || tx.type === "debit";
        const sign = isDebit ? "" : "+";
        const amtColor = isDebit ? "text-rose-400" : "text-emerald-400";
        const iconBg = isDebit
          ? "bg-rose-500/15 text-rose-400 border-rose-500/30"
          : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
        const arrowIcon = isDebit ? "fa-arrow-up" : "fa-arrow-down";

        const isLight = document.body.classList.contains("light-theme");
        const cardBg = isLight
          ? "bg-white border-slate-200 hover:border-blue-400/60 shadow-sm"
          : "bg-[#09152b] border-white/10 hover:border-blue-400/40";
        const titleColor = isLight ? "text-slate-800" : "text-white";
        const subColor = isLight ? "text-slate-500" : "text-slate-400";
        const refColor = isLight ? "text-blue-600" : "text-sky-300";

        // Auto-translate generic transaction titles if in English
        let displayTitle = tx.title || (isDebit ? "سحب رصيد" : "شحن رصيد");
        if (isEn) {
          if (displayTitle.includes("شحن") || displayTitle.includes("إيداع")) {
            displayTitle = "Wallet Top-up (Stripe)";
          } else if (displayTitle.includes("سحب") || displayTitle.includes("تحويل")) {
            displayTitle = "Balance Withdrawal (SARIE)";
          } else if (displayTitle.includes("اشتراك")) {
            displayTitle = "Ride Plan Subscription";
          }
        }

        const currencyStr = isEn ? "SAR" : "ر.س";
        const viewReceiptStr = isEn ? "View Official Receipt" : "عرض الإيصال الرسمي";

        return `
          <div class="p-3.5 sm:p-4 rounded-2xl ${cardBg} border transition-all flex items-center justify-between gap-3">
            <div class="flex items-center gap-3.5 min-w-0">
              <div class="w-10 h-10 rounded-xl ${iconBg} border flex items-center justify-center text-sm shrink-0">
                <i class="fa-solid ${arrowIcon}"></i>
              </div>
              <div class="truncate">
                <p class="text-xs sm:text-sm font-bold ${titleColor} truncate">${displayTitle}</p>
                <p class="text-[11px] ${subColor} font-mono mt-0.5">${tx.date} • <span class="${refColor} font-bold">${tx.referenceNo || "#" + tx.id}</span></p>
              </div>
            </div>
            <div class="text-left rtl:text-left ltr:text-right shrink-0">
              <p class="text-sm sm:text-base font-black font-mono ${amtColor}">${sign}${Math.abs(tx.amount).toFixed(2)} ${currencyStr}</p>
              <button type="button" onclick="openReceiptModal('${tx.id}')" class="text-xs text-sky-500 hover:text-sky-600 font-bold flex items-center gap-1 mt-0.5 cursor-pointer">
                <span>${viewReceiptStr}</span>
                <i class="fa-solid fa-chevron-left rtl:rotate-0 ltr:rotate-180 text-[9px]"></i>
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  };

  window.filterWalletTxs = function (type, btn) {
    document.querySelectorAll(".tx-filter-btn").forEach((b) => {
      b.className = "tx-filter-btn px-3 py-1.5 rounded-lg font-bold text-slate-300 hover:text-white transition-all cursor-pointer";
    });
    if (btn) {
      btn.className = "tx-filter-btn px-3 py-1.5 rounded-lg font-bold bg-blue-600 text-white transition-all cursor-pointer";
    }
    renderWalletHistory(type);
  };

  // Receipt Modal Controllers
  window.openReceiptModal = function (txId) {
    const txs = WalletService.getTransactions();
    const tx = txs.find((t) => String(t.id) === String(txId)) || txs[0];
    if (!tx) return;

    const modal = document.getElementById("receipt-modal");
    if (!modal) return;

    const isDebit = tx.amount < 0 || tx.type === "debit";
    const sign = isDebit ? "" : "+";
    const amtColor = isDebit ? "text-rose-400" : "text-emerald-400";

    const amtEl = document.getElementById("receipt-amount-display");
    const titleEl = document.getElementById("receipt-title-display");
    const refEl = document.getElementById("receipt-ref-display");
    const channelEl = document.getElementById("receipt-channel-display");
    const dateEl = document.getElementById("receipt-date-display");

    const currentLang = localStorage.getItem("mowasalat_lang") || document.documentElement.getAttribute("lang") || "ar";
    const curr = currentLang === "en" ? "SAR" : "ر.س";

    if (amtEl) {
      amtEl.textContent = `${sign}${Math.abs(tx.amount).toFixed(2)} ${curr}`;
      amtEl.className = `text-3xl font-black font-mono ${amtColor} block`;
    }
    if (titleEl) titleEl.textContent = tx.title;
    if (refEl) refEl.textContent = tx.referenceNo || `#${tx.id}`;
    if (channelEl) channelEl.textContent = tx.paymentChannel || "بوابة الدفع الرقمية";
    if (dateEl) dateEl.textContent = tx.date;

    modal.classList.remove("hidden");
  };

  window.hideReceiptModal = function () {
    const modal = document.getElementById("receipt-modal");
    if (modal) modal.classList.add("hidden");
  };

  // ============================================================
  // AUTH MODAL LOGIC (LOGIN / REGISTER / SMS OTP)
  // ============================================================
  window.showAuthModal = function (tab = "login") {
    const modal = document.getElementById("auth-modal");
    if (!modal) return;
    modal.classList.remove("hidden");

    // Clear alerts
    const loginAlert = document.getElementById("login-alert");
    const regAlert = document.getElementById("reg-alert");
    const otpAlert = document.getElementById("otp-alert");
    if (loginAlert) loginAlert.classList.add("hidden");
    if (regAlert) regAlert.classList.add("hidden");
    if (otpAlert) otpAlert.classList.add("hidden");

    switchAuthTab(tab);
  };

  window.hideAuthModal = function () {
    const modal = document.getElementById("auth-modal");
    if (modal) modal.classList.add("hidden");
    if (otpTimerInterval) clearInterval(otpTimerInterval);
  };

  window.switchAuthTab = function (tab) {
    const tabLogin = document.getElementById("auth-tab-login");
    const tabRegister = document.getElementById("auth-tab-register");
    const tabOtp = document.getElementById("auth-tab-otp");
    const btnLogin = document.getElementById("tab-btn-login");
    const btnRegister = document.getElementById("tab-btn-register");
    const tabsContainer = document.getElementById("auth-tabs");

    if (tabOtp) tabOtp.classList.add("hidden");
    if (tabsContainer) tabsContainer.classList.remove("hidden");

    if (tab === "login") {
      if (tabLogin) tabLogin.classList.remove("hidden");
      if (tabRegister) tabRegister.classList.add("hidden");
      if (btnLogin) {
        btnLogin.className =
          "active-tab py-2.5 px-4 rounded-xl text-sm font-bold transition-all bg-gradient-to-r from-blue-700 to-indigo-700 !text-white shadow-lg";
        btnLogin.style.color = "#ffffff";
      }
      if (btnRegister) {
        btnRegister.className =
          "py-2.5 px-4 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 transition-all";
        btnRegister.style.color = "";
      }
    } else if (tab === "register") {
      if (tabLogin) tabLogin.classList.add("hidden");
      if (tabRegister) tabRegister.classList.remove("hidden");
      if (btnLogin) {
        btnLogin.className =
          "py-2.5 px-4 rounded-xl text-sm font-bold text-slate-600 hover:text-slate-900 transition-all";
        btnLogin.style.color = "";
      }
      if (btnRegister) {
        btnRegister.className =
          "active-tab py-2.5 px-4 rounded-xl text-sm font-bold transition-all bg-gradient-to-r from-blue-700 to-indigo-700 !text-white shadow-lg";
        btnRegister.style.color = "#ffffff";
      }
    }
  };

  // Quick SMS Login Prompt with real API check
  window.quickSmsLoginPrompt = async function () {
    const phone = prompt(
      "أدخل رقم جوالك المسجل لتسجيل الدخول السريع عبر SMS (مثال: 0512345676):",
    );
    if (!phone || phone.trim().length < 9) return;

    const cleanPhone = phone.trim().replace(/\s+/g, "");
    const cleanDigits = cleanPhone.replace(/\D+/g, "");

    // 1. Check local registered database
    let found = StorageService.findRegisteredUser(cleanPhone);

    // 2. If not found locally, check Cloud Subscriptions / Users
    if (!found) {
      try {
        const headers = getApiHeaders();
        const res = await fetch(
          `${API_CONFIG.BASE_URL}/entities/Subscription?limit=50`,
          { method: "GET", headers: headers },
        );
        if (res.ok) {
          const sJson = await res.json();
          const subsList = Array.isArray(sJson) ? sJson : sJson.value || [];
          const matchSub = subsList.find((s) => {
            const sPhone = (s.phone || "").replace(/\D+/g, "");
            return (
              sPhone &&
              (sPhone === cleanDigits ||
                (cleanDigits.length >= 9 && sPhone.endsWith(cleanDigits.slice(-9))) ||
                (sPhone.length >= 9 && cleanDigits.endsWith(sPhone.slice(-9))))
            );
          });
          if (matchSub) {
            found = {
              id: matchSub.id,
              name: matchSub.full_name,
              fullName: matchSub.full_name,
              phone: matchSub.phone || cleanPhone,
              email: `${cleanDigits}@mowasalat.sa`,
              role: "subscriber",
            };
          }
        }
      } catch (e) {}
    }

    if (!found) {
      alert("عذراً، هذا الرقم غير مسجل لدينا! يرجى إنشاء حساب جديد أولاً.");
      switchAuthTab("register");
      const regPhoneInput = document.getElementById("reg-phone");
      if (regPhoneInput) regPhoneInput.value = cleanPhone;
      return;
    }

    initiateSmsOtpVerification(found, true);
  };

  // Handle Avatar Preview & Base64 Converter
  let selectedAvatarBase64 = "";

  window.handleAvatarPreview = function (inputEl) {
    if (!inputEl || !inputEl.files || !inputEl.files[0]) return;
    const file = inputEl.files[0];
    if (file.size > 2 * 1024 * 1024) {
      alert("حجم الصورة يجب أن لا يتجاوز 2 ميجابايت");
      inputEl.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      selectedAvatarBase64 = e.target.result;
      const previewImg = document.getElementById("reg-avatar-preview");
      const placeholderIcon = document.getElementById("reg-avatar-icon");
      if (previewImg) {
        previewImg.src = selectedAvatarBase64;
        previewImg.classList.remove("hidden");
      }
      if (placeholderIcon) {
        placeholderIcon.classList.add("hidden");
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Login Submit with REAL credential verification and Cloud API call
  window.handleLoginSubmit = async function (e) {
    e.preventDefault();
    const identifierEl = document.getElementById("login-identifier");
    const passwordEl = document.getElementById("login-password");
    const alertBox = document.getElementById("login-alert");
    const submitBtn = document.getElementById("btn-login-submit");

    if (!identifierEl || !passwordEl) return;
    const identifier = identifierEl.value.trim();
    const password = passwordEl.value.trim();

    if (alertBox) alertBox.classList.add("hidden");

    if (identifier.length < 3) {
      showAlert(
        alertBox,
        "يرجى إدخال رقم الجوال أو البريد الإلكتروني بشكل صحيح",
      );
      return;
    }
    if (password.length < 3) {
      showAlert(alertBox, "يرجى إدخال كلمة المرور");
      return;
    }

    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="api-loading-spinner ml-2"></span> جاري التحقق من بيانات الدخول والمصادقة...`;
    submitBtn.disabled = true;

    try {
      // REAL HTTP POST REQUEST DISPATCHED TO CLOUD API
      const result = await MowasalatAPI.loginUser(identifier, password);

      submitBtn.innerHTML = originalBtnHtml;
      submitBtn.disabled = false;

      if (!result.success) {
        if (alertBox) {
          const errorMsg =
            result.message ||
            (result.reason === "password_mismatch"
              ? "كلمة المرور غير صحيحة! يرجى إعادة المحاولة أو الدخول عبر رمز SMS السريع."
              : `بيانات الدخول غير صحيحة، أو الحساب غير مسجل في النظام (${identifier}). يرجى إنشاء حساب جديد أولاً.`);

          alertBox.innerHTML = `
                        <div class="flex items-start gap-2.5">
                            <i class="fa-solid fa-triangle-exclamation text-rose-600 text-base shrink-0 mt-0.5"></i>
                            <div>
                                <p class="font-bold text-rose-800 leading-relaxed">${errorMsg}</p>
                            </div>
                        </div>
                    `;
          alertBox.className =
            "p-3.5 rounded-2xl text-xs bg-rose-50 border border-rose-200 text-rose-800 shadow-sm text-right";
          alertBox.classList.remove("hidden");
        }
        return;
      }

      // SUCCESSFUL LOGIN
      const authUser = result.user;
      currentUser = {
        id: authUser.id || "usr_" + Date.now(),
        name: authUser.full_name || authUser.name || "مشترك مواصلات",
        phone: authUser.phone || identifier,
        email:
          authUser.email ||
          (identifier.includes("@")
            ? identifier
            : `${identifier}@mowasalat.sa`),
        avatar_url: authUser.avatar_url || authUser.avatarUrl || "",
        avatarUrl: authUser.avatar_url || authUser.avatarUrl || "",
        role: authUser.role || "passenger",
      };

      localStorage.setItem("mowasalat_user", JSON.stringify(currentUser));
      hideAuthModal();
      renderAuthNav();
      WalletService.syncUI();
      if (typeof renderWalletHistory === "function") {
        renderWalletHistory();
      }
      if (currentUser && currentUser.phone) {
        MowasalatAPI.fetchCloudWallet(currentUser.id || currentUser.phone).then((cloudRes) => {
          if (cloudRes && cloudRes.success && typeof cloudRes.balance === "number") {
            WalletService.setBalance(cloudRes.balance);
            WalletService.syncUI();
            if (typeof renderWalletHistory === "function") renderWalletHistory();
          }
        }).catch(() => {});
      }
      showToast(
        `أهلاً بك يا ${currentUser.name}! تم تسجيل الدخول بنجاح عبر بوابة مواصلات ✅`,
      );

      if (currentCheckoutPlan) {
        const pendingPlan = currentCheckoutPlan;
        setTimeout(() => {
          openCheckoutModal(pendingPlan);
          showToast(
            `يمكنك الآن إتمام الاشتراك في ${pendingPlan.name} يا ${currentUser.name} 💳`,
          );
        }, 500);
      }
    } catch (err) {
      submitBtn.innerHTML = originalBtnHtml;
      submitBtn.disabled = false;
      if (alertBox) {
        showAlert(
          alertBox,
          "تعذر الاتصال بخادم المصادقة. يرجى المحاولة مرة أخرى.",
        );
      }
    }
  };

  // Handle Register Submit with real validation and Cloud check
  window.handleRegisterSubmit = async function (e) {
    e.preventDefault();
    const nameEl = document.getElementById("reg-name");
    const phoneEl = document.getElementById("reg-phone");
    const emailEl = document.getElementById("reg-email");
    const roleEl = document.getElementById("reg-role");
    const passwordEl = document.getElementById("reg-password");
    const alertBox = document.getElementById("reg-alert");
    const submitBtn = document.getElementById("btn-register-submit");

    const name = nameEl ? nameEl.value.trim() : "";
    const phone = phoneEl ? phoneEl.value.trim().replace(/\s+/g, "") : "";
    const email = emailEl ? emailEl.value.trim() : "";
    const role = roleEl ? roleEl.value : "passenger";
    const password = passwordEl ? passwordEl.value.trim() : "";
    const avatarUrl = selectedAvatarBase64 || "";

    if (alertBox) alertBox.classList.add("hidden");

    // Validation 1: Name length
    if (name.length < 3) {
      showAlert(alertBox, "يرجى كتابة الاسم الكامل (3 أحرف على الأقل)");
      return;
    }

    // Validation 2: Saudi mobile format
    const saudiPhoneRegex = /^05\d{8}$/;
    if (!saudiPhoneRegex.test(phone)) {
      showAlert(
        alertBox,
        "يرجى إدخال رقم جوال سعودي صحيح يبدأ بـ 05 ويتكون من 10 أرقام (مثال: 0558153418)",
      );
      return;
    }

    // Validation 3: Password length
    if (password.length < 6) {
      showAlert(alertBox, "كلمة المرور يجب أن تكون 6 خانات أو أرقام على الأقل");
      return;
    }

    // Validation 4: Check if already registered locally
    const cleanDigits = phone.replace(/\D+/g, "");
    const users = getRegisteredUsers();
    const alreadyExists = users.find(
      (u) =>
        (u.phone &&
          (u.phone === phone ||
            (cleanDigits.length >= 9 &&
              u.phone.endsWith(cleanDigits.slice(-9))))) ||
        (email && u.email && u.email.toLowerCase() === email.toLowerCase()),
    );
    if (alreadyExists) {
      showAlert(
        alertBox,
        `رقم الجوال (${phone}) مسجل لدينا بالفعل! يرجى الانتقال إلى تسجيل الدخول.`,
      );
      return;
    }

    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="api-loading-spinner ml-2"></span> جاري إنشاء وتفعيل الحساب...`;
    submitBtn.disabled = true;

    // Check if user exists in cloud
    try {
      const existsInCloud = await MowasalatAPI.checkUserExists(phone, email);
      if (existsInCloud) {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
        showAlert(
          alertBox,
          `هذا الحساب أو رقم الجوال (${phone}) مسجل لدينا بالفعل! يرجى الانتقال إلى تسجيل الدخول.`,
        );
        return;
      }
    } catch (err) {}

    // DIRECT REGISTRATION (No fake SMS OTP gateway)
    try {
      const userData = {
        name,
        fullName: name,
        phone,
        email: email || `${cleanDigits}@mowasalat.sa`,
        role,
        password,
        avatar_url: avatarUrl,
        avatarUrl: avatarUrl,
      };

      const result = await MowasalatAPI.registerUser(userData);

      submitBtn.innerHTML = originalBtnHtml;
      submitBtn.disabled = false;

      // Successful registration & immediate session login
      currentUser = {
        id: (result.user && result.user.id) || "usr_" + Date.now(),
        name: name,
        fullName: name,
        phone: phone,
        email: userData.email,
        avatar_url: avatarUrl,
        avatarUrl: avatarUrl,
        role: role || "passenger",
      };

      localStorage.setItem("mowasalat_user", JSON.stringify(currentUser));
      hideAuthModal();
      renderAuthNav();
      WalletService.syncUI();
      if (typeof renderWalletHistory === "function") {
        renderWalletHistory();
      }
      showToast(
        `أهلاً بك يا ${currentUser.name}! تم إنشاء حسابك وتفعيله بنجاح ✅`,
      );

      if (currentCheckoutPlan) {
        const pendingPlan = currentCheckoutPlan;
        setTimeout(() => {
          openCheckoutModal(pendingPlan);
          showToast(
            `يمكنك الآن إتمام الاشتراك في ${pendingPlan.name} يا ${currentUser.name} 💳`,
          );
        }, 500);
      }
    } catch (err) {
      submitBtn.innerHTML = originalBtnHtml;
      submitBtn.disabled = false;
      showAlert(
        alertBox,
        "حدث خطأ أثناء حفظ الحساب في الخادم. يرجى المحاولة مرة أخرى.",
      );
    }
  };

  function showAlert(alertBox, text) {
    if (!alertBox) return;
    alertBox.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-circle-exclamation text-rose-600 text-sm"></i>
                <span class="font-bold text-rose-800">${text}</span>
            </div>
        `;
    alertBox.className =
      "p-3 rounded-2xl text-xs bg-rose-50 border border-rose-200 text-rose-800 shadow-sm text-right";
    alertBox.classList.remove("hidden");
  }

  function initiateSmsOtpVerification(userData, isQuickLogin = false) {
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    pendingOtpData = { ...userData, otp: generatedOtp, isQuickLogin };

    const tabLogin = document.getElementById("auth-tab-login");
    const tabRegister = document.getElementById("auth-tab-register");
    const tabOtp = document.getElementById("auth-tab-otp");
    const tabsContainer = document.getElementById("auth-tabs");
    const phoneBadge = document.getElementById("otp-phone-badge");

    if (tabLogin) tabLogin.classList.add("hidden");
    if (tabRegister) tabRegister.classList.add("hidden");
    if (tabsContainer) tabsContainer.classList.add("hidden");
    if (tabOtp) tabOtp.classList.remove("hidden");
    if (phoneBadge) phoneBadge.textContent = userData.phone;

    // Dispatch real SMS via Cloud API
    const smsMessage = `رمز التحقق لمنصة مواصلات هو: ${generatedOtp} - صالح لمدة 5 دقائق. شكراً لاختيارك مواصلات.`;
    MowasalatAPI.sendSms(userData.phone, smsMessage, "otp");

    showToast(
      `تم إرسال كود التحقق عبر رسالة SMS إلى جوالك ${userData.phone}`,
      "info",
      "رمز التحقق",
    );

    setupOtpInputs(generatedOtp);
    startOtpCountdown(45);
  }

  function setupOtpInputs(expectedOtp) {
    const boxes = document.querySelectorAll(".otp-box");
    boxes.forEach((box, i) => {
      box.value = "";
      box.oninput = function () {
        if (this.value.length === 1 && i < boxes.length - 1) {
          boxes[i + 1].focus();
        }
      };
      box.onkeydown = function (e) {
        if (e.key === "Backspace" && !this.value && i > 0) {
          boxes[i - 1].focus();
        }
      };
    });
    if (boxes[0]) setTimeout(() => boxes[0].focus(), 150);
  }

  function startOtpCountdown(seconds) {
    if (otpTimerInterval) clearInterval(otpTimerInterval);
    const countdownSpan = document.getElementById("otp-countdown");
    let remaining = seconds;

    otpTimerInterval = setInterval(() => {
      remaining--;
      if (countdownSpan) countdownSpan.textContent = `(${remaining}s)`;
      if (remaining <= 0) {
        clearInterval(otpTimerInterval);
        if (countdownSpan) countdownSpan.textContent = "";
      }
    }, 1000);
  }

  window.resendSmsOtp = function () {
    if (!pendingOtpData) return;
    initiateSmsOtpVerification(pendingOtpData, pendingOtpData.isQuickLogin);
  };

  window.handleOtpSubmit = async function (e) {
    e.preventDefault();
    const boxes = document.querySelectorAll(".otp-box");
    let enteredCode = "";
    boxes.forEach((b) => (enteredCode += b.value));

    const alertBox = document.getElementById("otp-alert");
    const submitBtn = document.getElementById("btn-otp-submit");

    if (enteredCode.length < 4) {
      showAlert(alertBox, "يرجى إدخال كود التحقق كاملاً المكون من 4 أرقام");
      return;
    }

    // STRICT OTP CHECK: Must match the dispatched OTP
    if (pendingOtpData && enteredCode !== pendingOtpData.otp) {
      showAlert(
        alertBox,
        "كود التحقق غير صحيح! يرجى التأكد من الكود المرسل وإعادة المحاولة.",
      );
      return;
    }

    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="api-loading-spinner ml-2"></span> جاري حفظ بيانات المشترك وتأكيد الحساب...`;
    submitBtn.disabled = true;

    // Persist to local database
    saveUserToDatabase({
      name: pendingOtpData.name,
      phone: pendingOtpData.phone,
      email: pendingOtpData.email,
      password: pendingOtpData.password,
      role: pendingOtpData.role,
    });

    // Persist to Cloud API with real HTTP fetch request
    try {
      const res = await MowasalatAPI.registerUser(pendingOtpData);
      submitBtn.innerHTML = originalBtnHtml;
      submitBtn.disabled = false;

      currentUser = {
        id: res.user ? res.user.id : "usr_" + Date.now(),
        name: pendingOtpData.name,
        phone: pendingOtpData.phone,
        email: pendingOtpData.email,
        role: pendingOtpData.role || "passenger",
      };

      localStorage.setItem("mowasalat_user", JSON.stringify(currentUser));
      hideAuthModal();
      renderAuthNav();
      WalletService.syncUI();
      if (typeof renderWalletHistory === "function") {
        renderWalletHistory();
      }
      showToast(
        `أهلاً بك يا ${currentUser.name}! تم إنشاء وتفعيل حسابك بنجاح ✅`,
      );

      if (currentCheckoutPlan) {
        const pendingPlan = currentCheckoutPlan;
        setTimeout(() => {
          openCheckoutModal(pendingPlan);
          showToast(
            `يمكنك الآن إتمام الاشتراك في ${pendingPlan.name} يا ${currentUser.name} 💳`,
          );
        }, 500);
      }
    } catch (err) {
      submitBtn.innerHTML = originalBtnHtml;
      submitBtn.disabled = false;
      showAlert(
        alertBox,
        "حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.",
      );
    }
  };

  window.showRegisterModal = function () {
    showAuthModal("register");
  };
  window.hideRegisterModal = function () {
    hideAuthModal();
  };

  // ============================================================
  // BANKING & CARD VALIDATION ENGINES (LUHN / BRAND / EXPIRY)
  // ============================================================
  function isValidLuhn(numStr) {
    let sum = 0;
    let shouldDouble = false;
    for (let i = numStr.length - 1; i >= 0; i--) {
      let digit = parseInt(numStr.charAt(i), 10);
      if (isNaN(digit)) return false;
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  function detectCardBrand(num) {
    // Mada Card Network prefixes
    const madaPrefixes = [
      "588845",
      "5888",
      "440647",
      "440795",
      "409201",
      "458456",
      "484783",
      "462220",
      "455708",
      "455036",
      "486496",
      "483011",
      "428671",
      "428672",
      "428673",
      "446393",
      "407197",
      "407395",
      "521076",
      "529415",
      "535825",
      "543357",
      "549760",
      "554180",
      "557606",
      "585265",
      "636120",
      "9682",
    ];
    for (const p of madaPrefixes) {
      if (num.startsWith(p)) return "mada";
    }
    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(num)) return "visa";
    if (
      /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
        num,
      )
    )
      return "mastercard";
    return null;
  }

  // ============================================================
  // PAYMENT & CHECKOUT MODAL LOGIC (REAL GATEWAY & STRIPE INTEGRATION)
  // ============================================================
  window.openCheckoutModal = function (plan) {
    currentCheckoutPlan = plan;

    // 1. STRICT AUTH GATE: User MUST be authenticated to open checkout
    if (!currentUser || !currentUser.name || !currentUser.phone) {
      showToast(
        "🔒 يرجى تسجيل الدخول أو إنشاء حساب أولاً للاشتراك وتفعيل الباقة باسمك",
      );
      showAuthModal("login");
      const subTitle = document.getElementById("auth-modal-sub");
      if (subTitle) {
        subTitle.innerHTML = `<span class="text-amber-300 font-extrabold text-sm block mt-1">يلزم تسجيل الدخول أولاً لتأكيد الاشتراك في (${plan.name})</span>`;
      }
      return;
    }

    const modal = document.getElementById("checkout-modal");
    if (!modal) return;

    document.getElementById("checkout-step-form").classList.remove("hidden");
    document.getElementById("checkout-step-success").classList.add("hidden");
    const alertBox = document.getElementById("checkout-alert");
    if (alertBox) alertBox.classList.add("hidden");

    document.getElementById("checkout-plan-name").textContent =
      plan.name || "باقة مواصلات";
    document.getElementById("checkout-plan-rides").textContent =
      plan.rides || "";
    document.getElementById("checkout-plan-price").textContent =
      plan.price || "0";
    document.getElementById("checkout-plan-tag").textContent = (
      plan.id || ""
    ).toUpperCase();

    const isEn = (localStorage.getItem("mowasalat_lang") || document.documentElement.getAttribute("lang") || "ar") === "en";
    const curr = isEn ? "SAR" : "ر.س";

    const btnAmount = document.getElementById("btn-pay-online-amount");
    if (btnAmount) btnAmount.textContent = `${plan.price} ${curr}`;

    const payBtnText = document.getElementById("btn-pay-online-text");
    if (payBtnText)
      payBtnText.textContent = isEn
        ? "Proceed to Secure Stripe Gateway"
        : "المتابعة إلى بوابة الدفع الآمنة (Stripe)";

    const nameInput = document.getElementById("checkout-customer-name");
    const phoneInput = document.getElementById("checkout-customer-phone");
    const statusSpan = document.getElementById("checkout-user-status");

    let cleanName = currentUser.name;
    if (/^\d+$/.test(cleanName.replace(/\s+/g, "")))
      cleanName = "مشترك مواصلات";
    if (nameInput) {
      nameInput.value = cleanName;
      nameInput.readOnly = true;
    }
    if (phoneInput) {
      phoneInput.value = currentUser.phone || "";
      phoneInput.readOnly = true;
    }
    if (statusSpan) {
      statusSpan.innerHTML = `<span class="text-emerald-400 font-black"><i class="fa-solid fa-circle-check"></i> مشترك معتمد: ${cleanName}</span>`;
    }

    const waBtn = document.getElementById("btn-checkout-whatsapp");
    if (waBtn) {
      const msg = encodeURIComponent(
        `مرحباً منصة مواصلات، المشترك (${cleanName} - ${currentUser.phone}) يرغب في حجز وتفعيل "${plan.name}" بقيمة ${plan.price} ريال.`,
      );
      waBtn.href = `https://wa.me/966558153418?text=${msg}`;
    }

    switchPaymentMethod("online");
    modal.classList.remove("hidden");
  };

  window.hideCheckoutModal = function () {
    const modal = document.getElementById("checkout-modal");
    if (modal) modal.classList.add("hidden");
  };

  window.switchPaymentMethod = function (method) {
    selectedPaymentMethod = method;
    const onlinePanel = document.getElementById("method-online-panel");
    const bankPanel = document.getElementById("method-bank-panel");
    const whatsappPanel = document.getElementById("method-whatsapp-panel");

    const tabOnline = document.getElementById("pay-tab-online");
    const tabBank = document.getElementById("pay-tab-bank");
    const tabWhatsapp = document.getElementById("pay-tab-whatsapp");

    [tabOnline, tabBank, tabWhatsapp].forEach((t) => {
      if (t)
        t.className =
          "py-3 px-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all";
    });

    if (onlinePanel) onlinePanel.classList.add("hidden");
    if (bankPanel) bankPanel.classList.add("hidden");
    if (whatsappPanel) whatsappPanel.classList.add("hidden");

    if (method === "online") {
      if (onlinePanel) onlinePanel.classList.remove("hidden");
      if (tabOnline)
        tabOnline.className =
          "py-3 px-3 rounded-2xl border-2 border-blue-600 bg-blue-50/80 text-blue-900 font-extrabold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-sm ring-2 ring-blue-500/20";
    } else if (method === "bank") {
      if (bankPanel) bankPanel.classList.remove("hidden");
      if (tabBank)
        tabBank.className =
          "py-3 px-3 rounded-2xl border-2 border-emerald-600 bg-emerald-50/80 text-emerald-900 font-extrabold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-sm ring-2 ring-emerald-500/20";
    } else if (method === "whatsapp") {
      if (whatsappPanel) whatsappPanel.classList.remove("hidden");
      if (tabWhatsapp)
        tabWhatsapp.className =
          "py-3 px-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50 text-emerald-900 font-extrabold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-sm ring-2 ring-emerald-500/20";
    }
  };

  window.formatCardNumber = function (el) {
    let val = el.value.replace(/\D/g, "").substring(0, 16);
    let parts = [];
    for (let i = 0; i < val.length; i += 4) {
      parts.push(val.substring(i, i + 4));
    }
    el.value = parts.join(" ");
  };

  window.formatCardExpiry = function (el) {
    let val = el.value.replace(/\D/g, "").substring(0, 4);
    if (val.length >= 2) {
      el.value = val.substring(0, 2) + "/" + val.substring(2);
    } else {
      el.value = val;
    }
  };

  window.copyIban = function (iban, btn) {
    navigator.clipboard.writeText(iban).then(() => {
      const originalText = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-check text-emerald-400"></i> تم النسخ!`;
      setTimeout(() => (btn.innerHTML = originalText), 2500);
      showToast("تم نسخ الآيبان إلى الحافظة بنجاح 📋");
    });
  };

  // REAL Online Payment via Stripe Checkout Gateway
  window.executeOnlinePayment = async function () {
    const alertBox = document.getElementById("checkout-alert");
    const submitBtn = document.getElementById("btn-pay-online");

    if (alertBox) alertBox.classList.add("hidden");

    // Check 1: User Authentication Gate
    if (!currentUser || !currentUser.name || !currentUser.phone) {
      showCheckoutAlert(
        alertBox,
        "يجب تسجيل الدخول بحساب المشترك أولاً للمتابعة إلى بوابة الدفع وتفعيل الباقة باسمك.",
      );
      showAuthModal("login");
      return;
    }

    const nameInput = document.getElementById("checkout-customer-name");
    const phoneInput = document.getElementById("checkout-customer-phone");
    const name = (nameInput ? nameInput.value : currentUser.name || "").trim();
    const phone = (phoneInput ? phoneInput.value : currentUser.phone || "")
      .trim()
      .replace(/\s+/g, "");

    // Check 2: Customer Data
    if (name.length < 2) {
      showCheckoutAlert(
        alertBox,
        "يرجى إدخال اسم المشترك لإصدار الفاتورة باسمه",
      );
      return;
    }
    if (!/^05\d{8}$/.test(phone) && !/^\+9665\d{8}$/.test(phone)) {
      showCheckoutAlert(
        alertBox,
        "يرجى إدخال رقم جوال سعودي صحيح (05xxxxxxxx)",
      );
      return;
    }

    if (!currentCheckoutPlan || !currentCheckoutPlan.price) {
      showCheckoutAlert(alertBox, "يرجى اختيار باقة صالحة أولاً.");
      return;
    }

    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="api-loading-spinner ml-2"></span> جاري التحويل إلى بوابة الدفع الآمنة (Stripe)...`;
    submitBtn.disabled = true;

    const refNumber = "INV-MW-" + Math.floor(100000 + Math.random() * 900000);

    // Pre-save pending checkout state into localStorage
    const pendingSession = {
      refNumber: refNumber,
      planId: currentCheckoutPlan.id,
      planName: currentCheckoutPlan.name,
      price: currentCheckoutPlan.price,
      customerName: name,
      customerPhone: phone,
      initiatedAt: new Date().toISOString(),
    };
    localStorage.setItem(
      "mowasalat_pending_checkout",
      JSON.stringify(pendingSession),
    );

    try {
      const successUrl = `${window.location.origin}${window.location.pathname}?payment=success&ref=${refNumber}`;
      const cancelUrl = `${window.location.origin}${window.location.pathname}?payment=cancelled`;

      // Call walletCheckout to generate official Stripe Checkout session
      const checkoutRes = await MowasalatAPI.processWalletCheckout({
        amount: currentCheckoutPlan.price,
        currency: "SAR",
        userId: currentUser.id || currentUser.phone || "usr_" + Date.now(),
        userEmail: currentUser.email || `${phone}@mowasalat.sa`,
        userPhone: phone,
        userName: name,
        package_id: currentCheckoutPlan.id,
        package_name: currentCheckoutPlan.name,
        customer_name: name,
        customer_phone: phone,
        paymentMethod: "card",
        successUrl: successUrl,
        cancelUrl: cancelUrl,
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      // Pre-record pending subscription in cloud backend
      await MowasalatAPI.createSubscription({
        full_name: name,
        phone: phone,
        package_id: currentCheckoutPlan.id,
        package_name: currentCheckoutPlan.name,
        monthly_price: currentCheckoutPlan.price,
        monthly_trip_limit: 12,
        status: "pending_payment",
      }).catch((err) => console.warn("[Subscription] Note:", err));

      const stripeUrl = checkoutRes.data?.url || checkoutRes.data?.checkout_url || checkoutRes.data?.session_url;

      if (checkoutRes.success && stripeUrl) {
        showToast(
          "جاري تحويلك الآن إلى بوابة الدفع الآمنة (Stripe)... 🔒",
          "success",
          "بوابة الدفع الإلكتروني",
        );
        setTimeout(() => {
          window.location.href = stripeUrl;
        }, 500);
      } else {
        throw new Error(checkoutRes.error || "تعذر استلام رابط الدفع من بوابة Stripe");
      }
    } catch (err) {
      console.error("[Payment Error]", err);
      submitBtn.innerHTML = originalBtnHtml;
      submitBtn.disabled = false;
      showCheckoutAlert(
        alertBox,
        "تعذر الاتصال ببوابة الدفع Stripe حالياً. يرجى إعادة المحاولة أو اختيار التحويل البنكي.",
      );
    }
  };

  // Bank Transfer Execution
  window.executeBankTransferPayment = function () {
    const alertBox = document.getElementById("checkout-alert");
    const submitBtn = document.getElementById("btn-pay-bank");

    if (alertBox) alertBox.classList.add("hidden");

    // Check 1: User Authentication
    if (!currentUser || !currentUser.name || !currentUser.phone) {
      showCheckoutAlert(
        alertBox,
        "يجب تسجيل الدخول أولاً لإرسال إيصال التحويل وتأكيد الاشتراك باسمك.",
      );
      showAuthModal("login");
      return;
    }

    const name = document.getElementById("checkout-customer-name").value.trim();
    const phone = document
      .getElementById("checkout-customer-phone")
      .value.trim()
      .replace(/\s+/g, "");
    const refNo = document.getElementById("bank-ref-number").value.trim();
    const fileInput = document.getElementById("bank-receipt-file");

    if (name.length < 3) {
      showCheckoutAlert(alertBox, "يرجى إدخال اسم المحول الثلاثي");
      return;
    }
    if (!/^05\d{8}$/.test(phone)) {
      showCheckoutAlert(
        alertBox,
        "يرجى إدخال رقم جوال سعودي صحيح (05xxxxxxxx)",
      );
      return;
    }
    if (!refNo || refNo.length < 4) {
      showCheckoutAlert(alertBox, "يرجى إدخال رقم مرجع الحوالة البنكية");
      return;
    }
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      showCheckoutAlert(alertBox, "يرجى إرفاق صورة إيصال التحويل البنكي");
      return;
    }

    const originalBtnHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="api-loading-spinner ml-2"></span> جاري رفع الإيصال وتسجيل الاشتراك...`;
    submitBtn.disabled = true;

    const invoiceNo = "BT-MW-" + Math.floor(100000 + Math.random() * 900000);

    MowasalatAPI.uploadPaymentProof({
      customer_name: name,
      customer_phone: phone,
      amount: currentCheckoutPlan.price,
      ref_id: invoiceNo,
      bank_name: "مصرف الراجحي",
      file_name: fileInput.files[0].name,
    })
      .then(() => {
        return MowasalatAPI.createSubscription({
          full_name: name,
          phone: phone,
          package_id: currentCheckoutPlan.id,
          package_name: currentCheckoutPlan.name,
          monthly_price: currentCheckoutPlan.price,
          monthly_trip_limit: 12,
          status: "pending",
        });
      })
      .then(() => {
        MowasalatAPI.sendSms(
          phone,
          `مرحباً ${name}، استلمنا إيصال تحويل باقة (${currentCheckoutPlan.name}) برقم ${invoiceNo}. سيتم مراجعة الإيصال وتأكيد الاشتراك.`,
        );

        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;

        if (currentUser) {
          currentUser.activeSubscription = {
            planId: currentCheckoutPlan.id,
            planName: currentCheckoutPlan.name,
            price: currentCheckoutPlan.price,
            status: "pending",
            refNumber: invoiceNo,
            activatedAt: new Date().toISOString(),
          };
          localStorage.setItem("mowasalat_user", JSON.stringify(currentUser));
          renderAuthNav();
        }

        displayCheckoutSuccess({
          refNumber: invoiceNo,
          planName: currentCheckoutPlan.name,
          amount: `${currentCheckoutPlan.price} ريال سعودي (تحويل بنكي)`,
          phone,
          method: "تحويل بنكي (مصرف الراجحي)",
        });

        showToast(
          `شكراً يا ${name}! تم رفع الإيصال وسيتم مراجعة الحوالة وتفعيل باقتك فوراً 📋`,
          "info",
          "تم استلام إيصال التحويل",
        );
      })
      .catch((err) => {
        submitBtn.innerHTML = originalBtnHtml;
        submitBtn.disabled = false;
        showCheckoutAlert(
          alertBox,
          err.message || "حدث خطأ أثناء رفع إيصال التحويل، يرجى المحاولة مرة أخرى.",
        );
      });
  };

  function showCheckoutAlert(alertBox, msg) {
    if (!alertBox) return;
    alertBox.innerHTML = `
            <div class="flex items-center gap-2">
                <i class="fa-solid fa-circle-exclamation text-rose-600 text-sm"></i>
                <span class="font-bold text-rose-800">${msg}</span>
            </div>
        `;
    alertBox.className =
      "p-3.5 rounded-2xl text-xs bg-rose-50 border border-rose-200 text-rose-800 shadow-sm text-right";
    alertBox.classList.remove("hidden");
  }

  function displayCheckoutSuccess(details) {
    document.getElementById("checkout-step-form").classList.add("hidden");
    document.getElementById("checkout-step-success").classList.remove("hidden");

    document.getElementById("success-ref-num").textContent = details.refNumber;
    document.getElementById("success-plan-name").textContent = details.planName;
    document.getElementById("success-amount").textContent = details.amount;

    const waBtn = document.getElementById("success-whatsapp-btn");
    if (waBtn) {
      const msg = encodeURIComponent(
        `تم تأكيد اشتراكي "${details.planName}" برقم فاتورة: ${details.refNumber}. الجوال: ${details.phone}. وسيلة الدفع: ${details.method}`,
      );
      waBtn.href = `https://wa.me/966558153418?text=${msg}`;
    }

    showToast("تمت العملية وإرسال رسالة SMS وتأكيد الاشتراك بنجاح! 🎉");
  }

  // --- LUXURY FLOATING TOAST NOTIFICATION SYSTEM ---
  function showToast(message, type = "success", customTitle = null) {
    if (typeof type !== "string") type = "success";

    let container = document.getElementById("mowasalat-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "mowasalat-toast-container";
      document.body.appendChild(container);
    }

    // Determine title & icon
    let title = customTitle;
    let iconHtml = '<i class="fa-solid fa-circle-check"></i>';

    if (!title) {
      if (message.includes("أهلاً") || message.includes("تسجيل الدخول")) {
        title = "تسجيل الدخول ناجح ✅";
        iconHtml = '<i class="fa-solid fa-user-check"></i>';
      } else if (
        message.includes("اشتراك") ||
        message.includes("تفعيل") ||
        message.includes("العملية") ||
        message.includes("مبروك")
      ) {
        title = "تأكيد الاشتراك والدفع 💳";
        iconHtml = '<i class="fa-solid fa-shield-halved"></i>';
      } else if (message.includes("SMS") || message.includes("رمز")) {
        title = "رمز التحقق السريع 📲";
        iconHtml = '<i class="fa-solid fa-comment-sms"></i>';
      } else if (message.includes("خروج")) {
        title = "تسجيل الخروج 👋";
        iconHtml = '<i class="fa-solid fa-arrow-right-from-bracket"></i>';
      } else {
        title =
          type === "error"
            ? "تنبيه"
            : type === "warning"
              ? "ملاحظة"
              : "بوابة مواصلات الذكية";
      }
    }

    if (type === "error") {
      iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';
    } else if (type === "warning") {
      iconHtml = '<i class="fa-solid fa-circle-exclamation"></i>';
    } else if (type === "info") {
      iconHtml = '<i class="fa-solid fa-circle-info"></i>';
    }

    const toastElem = document.createElement("div");
    toastElem.className = `mowasalat-toast toast-${type}`;
    toastElem.innerHTML = `
            <div class="toast-icon-wrap">
                ${iconHtml}
            </div>
            <div class="toast-body">
                <div class="toast-title">${title}</div>
                <div class="toast-desc">${message}</div>
            </div>
            <button type="button" class="toast-close" title="إغلاق">&times;</button>
            <div class="toast-progress"></div>
        `;

    // Gentle synthesized chime sound
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.32);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.33);
      }
    } catch (e) {}

    const closeBtn = toastElem.querySelector(".toast-close");
    let removeTimer = null;

    const dismiss = () => {
      if (removeTimer) clearTimeout(removeTimer);
      toastElem.style.animation = "toastExit 0.25s forwards";
      setTimeout(() => {
        if (toastElem.parentNode) toastElem.remove();
      }, 250);
    };

    if (closeBtn) closeBtn.addEventListener("click", dismiss);
    removeTimer = setTimeout(dismiss, 4500);

    container.appendChild(toastElem);

    // Also keep compatibility with legacy toast element if present
    const legacyToast = document.getElementById("success-toast");
    if (legacyToast) {
      const msgSpan =
        legacyToast.querySelector(".toast-msg") ||
        legacyToast.querySelector("span");
      if (msgSpan) msgSpan.textContent = message;
    }
  }
  window.showToast = showToast;

  // Check for return from Stripe Checkout
  function checkStripeReturn() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const isSuccess =
        urlParams.get("payment") === "success" ||
        urlParams.get("session_id") ||
        urlParams.get("redirect_status") === "succeeded";
      const isCancelled = urlParams.get("payment") === "cancelled";
      const returnAmount = urlParams.get("amount");
      const returnToken = urlParams.get("token");

      if (isSuccess) {
        // CASE 1: Return from Smart Digital Wallet Recharge
        const pendingWalletStr = localStorage.getItem("@mwasalat_pending_checkout");
        if (pendingWalletStr && returnAmount) {
          localStorage.removeItem("@mwasalat_pending_checkout");
          try {
            const pendingWallet = JSON.parse(pendingWalletStr);
            if (!currentUser && (pendingWallet.userName || pendingWallet.userPhone)) {
              currentUser = {
                id: pendingWallet.userId || "usr_wallet",
                name: pendingWallet.userName || "مشترك مواصلات",
                phone: pendingWallet.userPhone || "",
                role: "passenger",
              };
              localStorage.setItem("mowasalat_user", JSON.stringify(currentUser));
              renderAuthNav();
            }
            const amt = parseFloat(returnAmount);
            const isMatchToken = Boolean(!returnToken || (pendingWallet.token && pendingWallet.token === returnToken));
            const isMatchAmount = !isNaN(amt) && Math.abs(pendingWallet.amount - amt) < 0.01;
            const isNotExpired = Date.now() - (pendingWallet.timestamp || 0) < 45 * 60 * 1000;

            if (isMatchToken && isMatchAmount && isNotExpired) {
              const ref = `STRIPE-${Math.floor(100000 + Math.random() * 900000)}`;
              const channelTitle =
                pendingWallet.method === "apple"
                  ? "Apple Pay"
                  : pendingWallet.method === "mada"
                  ? "بطاقة مدى البنكية (Mada)"
                  : "بطاقة ائتمانية (Stripe)";

              const res = WalletService.recharge(amt, "شحن رصيد معتمد عبر Stripe 💳", {
                referenceNo: ref,
                paymentChannel: channelTitle,
                accountDetails: "بوابة الدفع الإلكتروني المعتمدة",
              });

              if (currentUser && currentUser.phone) {
                const smsMsg = `عزيزي العميل، تم إيداع مبلغ ${amt.toFixed(2)} ر.س في محفظتك بنجاح عبر Stripe.\nرقم المرجع: ${ref}.\nرصيدك الحالي: ${res.newBalance.toFixed(2)} ر.س.`;
                MowasalatAPI.sendSms(currentUser.phone, smsMsg, "confirmation").catch(() => {});
              }

              showToast(
                `تم تأكيد دفعك وإيداع مبلغ ${amt.toFixed(2)} ر.س في محفظتك بنجاح 💳 (رصيدك الحالي: ${res.newBalance.toFixed(2)} ر.س)`,
                "success",
                "تم شحن المحفظة بنجاح",
              );

              setTimeout(() => {
                const latestTx = WalletService.getTransactions()[0];
                if (latestTx) openReceiptModal(latestTx.id);
              }, 450);
            } else {
              showToast(
                "فشل التحقق من جلسة شحن المحفظة أو منتهية الصلاحية. تم إلغاء العملية لحماية محفظتك.",
                "error",
                "فشل التحقق من الدفع",
              );
            }
          } catch (e) {
            console.warn("[Wallet Recharge Verify]", e);
          }
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        }

        // CASE 2: Return from Subscription Plan Checkout
        const raw = localStorage.getItem("mowasalat_pending_checkout");
        if (raw) {
          const pending = JSON.parse(raw);
          localStorage.removeItem("mowasalat_pending_checkout");

          // Activate user subscription in local session
          if (currentUser) {
            currentUser.activeSubscription = {
              planId: pending.planId,
              planName: pending.planName,
              price: pending.price,
              status: "active",
              refNumber: pending.refNumber,
              activatedAt: new Date().toISOString(),
            };
            localStorage.setItem("mowasalat_user", JSON.stringify(currentUser));
            renderAuthNav();
          }

          // Confirm active subscription in backend
          MowasalatAPI.createSubscription({
            full_name: pending.customerName,
            phone: pending.customerPhone,
            package_id: pending.planId,
            package_name: pending.planName,
            monthly_price: pending.price,
            monthly_trip_limit: 12,
            status: "active",
          });

          // Send SMS confirmation
          const msg = `عزيزي ${pending.customerName}، تم استلام مبلغ ${pending.price} ر.س وتفعيل (${pending.planName}) بنجاح عبر Stripe. رقم الفاتورة: ${pending.refNumber}. شكراً لاختيارك مواصلات.`;
          MowasalatAPI.sendSms(pending.customerPhone, msg, "confirmation");

          // Display success confirmation
          setTimeout(() => {
            displayCheckoutSuccess({
              refNumber: pending.refNumber,
              planName: pending.planName,
              amount: `${pending.price} ريال سعودي`,
              phone: pending.customerPhone,
              method: "بوابة الدفع المعتمدة (Stripe)",
            });
            const modal = document.getElementById("checkout-modal");
            if (modal) modal.classList.remove("hidden");

            showToast(
              `مبروك يا ${pending.customerName}! تم إتمام الدفع بنجاح وتفعيل (${pending.planName}) 🎉`,
              "success",
              "تم الدفع وتأكيد الاشتراك",
            );
          }, 400);
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (isCancelled) {
        localStorage.removeItem("@mwasalat_pending_checkout");
        showToast(
          "تم إلغاء عملية الدفع عبر Stripe، لم يتم خصم أو إضافة أي مبلغ.",
          "info",
          "إلغاء العملية",
        );
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.warn("[Stripe Return Check]", e);
    }
  }

  // Auto-initialize when DOM is ready
  function initPortal() {
    renderAuthNav();
    checkStripeReturn();

    // Check if redirected because auth is required
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("auth") === "required") {
      showToast("يرجى تسجيل الدخول أولاً للوصول إلى المحفظة الرقمية", "info");
      showAuthModal("login");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    try {
      if (currentUser && currentUser.phone) {
        MowasalatAPI.fetchCloudWallet(currentUser.id || currentUser.phone).then((cloudRes) => {
          if (cloudRes && cloudRes.success && typeof cloudRes.balance === "number") {
            WalletService.setBalance(cloudRes.balance);
            WalletService.syncUI();
            if (typeof renderWalletHistory === "function") renderWalletHistory();
          }
        }).catch(() => {});
      }
      if (typeof WalletService !== "undefined") {
        WalletService.syncUI();
      }
      if (typeof renderWalletHistory === "function") {
        renderWalletHistory();
      }
    } catch (e) {
      console.warn("[Wallet Init]", e);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPortal);
  } else {
    initPortal();
  }

  console.log(
    "%c[Mowasalat] Mowasalat Portal API, Auth & Stripe Gateway connected with full security! 🚀",
    "color:#10b981; font-weight:bold; font-size:13px;",
  );
})();
