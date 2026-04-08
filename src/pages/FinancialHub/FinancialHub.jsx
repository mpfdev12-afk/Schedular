import { useState, useEffect, useCallback } from "react";
import {
  fetchDataFromApi,
  sendDataToapi,
  deleteDataFromApi,
  updateDatatoapi,
} from "../../utils/api";
import { toast } from "react-toastify";
import BackButton from "../../components/BackButton/BackButton";
import "./FinancialHub.scss";

// Default icons for well-known category names (fallback)
const DEFAULT_ICONS = {
  Food: "🍽️",
  Transport: "🚗",
  EMI: "🏠",
  Entertainment: "🎬",
  Shopping: "🛍️",
  Health: "💊",
  Other: "📦",
  Rent: "🏘️",
  Utilities: "💡",
  Education: "📚",
  Travel: "✈️",
  Gym: "💪",
  Savings: "💰",
  Insurance: "🛡️",
  Medical: "🏥",
};
const FALLBACK_ICON = "📌";

const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
const todayStr = `${currentMonth}-${String(today.getDate()).padStart(2, "0")}`;

// ─── Sub-components ───────────────────────────────────────────────

function TrackTab({ categoryList, categoryIcons }) {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    date: todayStr,
    amount: "",
    category: "",
    customCategory: "",
    type: "expense",
    note: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((p) => {
      if (categoryList.length > 0 && (!p.category || (p.category === "__custom__" && !p.customCategory))) {
        return { ...p, category: categoryList[0] };
      } else if (categoryList.length === 0 && !p.category) {
        return { ...p, category: "__custom__" };
      }
      return p;
    });
  }, [categoryList]);

  const fetchExpenses = useCallback(() => {
    fetchDataFromApi("/finance/expense", { month: currentMonth })
      .then((res) => setExpenses(res?.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const resolvedCategory =
    form.category === "__custom__" ? form.customCategory.trim() : form.category;

  const getIcon = (cat) =>
    categoryIcons[cat] || DEFAULT_ICONS[cat] || FALLBACK_ICON;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0)
      return toast.error("Enter a valid amount");
    if (!resolvedCategory) return toast.error("Enter a category name");
    setLoading(true);
    sendDataToapi(
      "/finance/expense",
      JSON.stringify({ ...form, category: resolvedCategory }),
      "application/json",
    )
      .then(() => {
        toast.success("Entry added");
        setForm((p) => ({ ...p, amount: "", note: "", customCategory: "" }));
        fetchExpenses();
      })
      .catch(() => toast.error("Failed to add entry"))
      .finally(() => setLoading(false));
  };

  const handleDelete = (id) => {
    deleteDataFromApi(`/finance/expense/${id}`)
      .then(() => {
        toast.success("Deleted");
        fetchExpenses();
      })
      .catch(() => toast.error("Failed to delete"));
  };

  return (
    <div className="tab-content track-tab">
      <form className="add-form glass-card" onSubmit={handleAdd}>
        <h3>Add Entry</h3>
        <div className="form-row">
          <div className="field">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="hub-input"
            />
          </div>
          <div className="field">
            <label>Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 500"
              min="1"
              value={form.amount}
              onChange={(e) =>
                setForm((p) => ({ ...p, amount: e.target.value }))
              }
              className="hub-input"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="hub-select"
            >
              {categoryList.map((c) => (
                <option key={c} value={c}>
                  {getIcon(c)} {c}
                </option>
              ))}
              <option value="__custom__">➕ Add new…</option>
            </select>
          </div>
          <div className="field">
            <label>Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
              className="hub-select"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
        </div>
        {form.category === "__custom__" && (
          <input
            type="text"
            placeholder="Category name (e.g. Petrol)"
            value={form.customCategory}
            onChange={(e) =>
              setForm((p) => ({ ...p, customCategory: e.target.value }))
            }
            className="hub-input"
          />
        )}
        <input
          type="text"
          placeholder="Note (optional)"
          value={form.note}
          onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
          className="hub-input"
        />
        <button type="submit" className="hub-btn" disabled={loading}>
          {loading ? "Adding..." : "+ Add Entry"}
        </button>
      </form>

      <div className="expense-list">
        <h3>This Month</h3>
        {expenses.length === 0 ? (
          <p className="empty-hint">
            No entries yet. Add your first one above.
          </p>
        ) : (
          expenses.map((e) => (
            <div key={e._id} className={`expense-item glass-card ${e.type}`}>
              <span className="cat-icon">{getIcon(e.category)}</span>
              <div className="expense-info">
                <span className="expense-cat">{e.category}</span>
                <span className="expense-note">{e.note || e.date}</span>
              </div>
              <span className={`expense-amount ${e.type}`}>
                {e.type === "expense" ? "−" : "+"}₹{e.amount.toLocaleString()}
              </span>
              <button
                className="delete-btn"
                onClick={() => handleDelete(e._id)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BudgetTab({ budgetData, onBudgetSaved }) {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(false);
  // draft: { catName: limit }  draftIcons: { catName: emoji }
  const [draftLimits, setDraftLimits] = useState({});
  const [draftIcons, setDraftIcons] = useState({});
  // new-category form
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("");
  const [newLimit, setNewLimit] = useState("");

  const { categories, categoryIcons } = budgetData;
  const catKeys = Object.keys(categories);

  useEffect(() => {
    setDraftLimits({ ...categories });
    setDraftIcons({ ...categoryIcons });
  }, [budgetData]);

  useEffect(() => {
    fetchDataFromApi("/finance/expense", { month: currentMonth })
      .then((res) => setExpenses(res?.data || []))
      .catch(() => {});
  }, []);

  const getIcon = (cat) =>
    categoryIcons[cat] || DEFAULT_ICONS[cat] || FALLBACK_ICON;

  const spending = catKeys.reduce((acc, c) => {
    acc[c] = expenses
      .filter((e) => e.category === c && e.type === "expense")
      .reduce((s, e) => s + e.amount, 0);
    return acc;
  }, {});

  const handleAddCategory = () => {
    const name = newName.trim();
    if (!name) return toast.error("Enter a category name");
    if (draftLimits[name] !== undefined)
      return toast.error("Category already exists");
    setDraftLimits((p) => ({ ...p, [name]: newLimit || 0 }));
    setDraftIcons((p) => ({
      ...p,
      [name]: newIcon || DEFAULT_ICONS[name] || FALLBACK_ICON,
    }));
    setNewName("");
    setNewIcon("");
    setNewLimit("");
  };

  const handleRemoveCategory = (cat) => {
    setDraftLimits((p) => {
      const n = { ...p };
      delete n[cat];
      return n;
    });
    setDraftIcons((p) => {
      const n = { ...p };
      delete n[cat];
      return n;
    });
  };

  const handleSave = () => {
    const cats = {};
    Object.keys(draftLimits).forEach((c) => {
      cats[c] = Number(draftLimits[c]) || 0;
    });
    sendDataToapi(
      "/finance/budget",
      JSON.stringify({
        month: currentMonth,
        categories: cats,
        categoryIcons: draftIcons,
      }),
      "application/json",
    )
      .then((res) => {
        const saved = res?.data?.data || {};
        onBudgetSaved({
          categories: saved.categories || cats,
          categoryIcons: saved.categoryIcons || draftIcons,
        });
        setEditing(false);
        toast.success("Budget saved");
      })
      .catch(() => toast.error("Failed to save budget"));
  };

  const handleCancel = () => {
    setDraftLimits({ ...categories });
    setDraftIcons({ ...categoryIcons });
    setNewName("");
    setNewIcon("");
    setNewLimit("");
    setEditing(false);
  };

  return (
    <div className="tab-content budget-tab">
      <div className="budget-header">
        <h3>
          {new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}{" "}
          Budget
        </h3>
        <div className="budget-header-actions">
          {editing ? (
            <>
              <button className="hub-btn-outline" onClick={handleCancel}>
                Cancel
              </button>
              <button className="hub-btn" onClick={handleSave}>
                Save
              </button>
            </>
          ) : (
            <button
              className="hub-btn-outline"
              onClick={() => setEditing(true)}
            >
              Edit Budget
            </button>
          )}
        </div>
      </div>

      <div className="budget-list">
        {(editing ? Object.keys(draftLimits) : catKeys).map((cat) => {
          const limit =
            Number(editing ? draftLimits[cat] : categories[cat]) || 0;
          const spent = spending[cat] || 0;
          const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
          const status = pct >= 100 ? "over" : pct >= 80 ? "warn" : "ok";
          const icon = editing
            ? draftIcons[cat] || DEFAULT_ICONS[cat] || FALLBACK_ICON
            : getIcon(cat);
          return (
            <div key={cat} className="budget-row glass-card">
              <div className="budget-row-top">
                <span className="budget-cat">
                  {editing ? (
                    <input
                      className="budget-icon-input"
                      value={draftIcons[cat] || ""}
                      placeholder="😀"
                      maxLength={2}
                      onChange={(e) =>
                        setDraftIcons((p) => ({ ...p, [cat]: e.target.value }))
                      }
                    />
                  ) : (
                    icon
                  )}{" "}
                  {cat}
                </span>
                <span className="budget-amounts">
                  ₹{spent.toLocaleString()} /{" "}
                  {editing ? (
                    <input
                      type="number"
                      className="budget-inline-input"
                      value={draftLimits[cat] || ""}
                      placeholder="limit"
                      min="0"
                      onChange={(e) =>
                        setDraftLimits((p) => ({ ...p, [cat]: e.target.value }))
                      }
                    />
                  ) : (
                    <span>₹{limit > 0 ? limit.toLocaleString() : "—"}</span>
                  )}
                  {editing && (
                    <button
                      className="cat-delete-btn"
                      onClick={() => handleRemoveCategory(cat)}
                      title="Remove"
                    >
                      ✕
                    </button>
                  )}
                </span>
              </div>
              {limit > 0 && (
                <div className="progress-track">
                  <div
                    className={`progress-fill ${status}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {editing && (
          <div className="budget-add-row glass-card">
            <input
              className="budget-icon-input"
              value={newIcon}
              placeholder="😀"
              maxLength={2}
              onChange={(e) => setNewIcon(e.target.value)}
            />
            <input
              className="hub-input add-cat-name"
              value={newName}
              placeholder="Category name"
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              type="number"
              className="hub-input add-cat-limit"
              value={newLimit}
              placeholder="₹ limit"
              min="0"
              onChange={(e) => setNewLimit(e.target.value)}
            />
            <button className="hub-btn-sm" onClick={handleAddCategory}>
              + Add
            </button>
          </div>
        )}

        {catKeys.length === 0 && !editing && (
          <p className="empty-hint">
            No budget set. Click "Edit Budget" to add categories.
          </p>
        )}
      </div>
    </div>
  );
}

function GoalsTab() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState({
    title: "",
    targetAmount: "",
    deadline: "",
  });
  const [contribute, setContribute] = useState({}); // goalId → amount string
  const [loading, setLoading] = useState(false);

  const fetchGoals = useCallback(() => {
    fetchDataFromApi("/finance/goals")
      .then((res) => setGoals(res?.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title || !form.targetAmount)
      return toast.error("Title and target are required");
    setLoading(true);
    sendDataToapi(
      "/finance/goal",
      JSON.stringify({ ...form, targetAmount: Number(form.targetAmount) }),
      "application/json",
    )
      .then(() => {
        toast.success("Goal created");
        setForm({ title: "", targetAmount: "", deadline: "" });
        fetchGoals();
      })
      .catch(() => toast.error("Failed to create goal"))
      .finally(() => setLoading(false));
  };

  const handleContribute = (goalId) => {
    const amount = Number(contribute[goalId]);
    if (!amount || amount <= 0) return toast.error("Enter a valid amount");
    updateDatatoapi(
      `/finance/goal/${goalId}/contribute`,
      JSON.stringify({ amount }),
      "application/json",
    )
      .then(() => {
        toast.success("Contribution added");
        setContribute((p) => ({ ...p, [goalId]: "" }));
        fetchGoals();
      })
      .catch(() => toast.error("Failed to add contribution"));
  };

  const handleDelete = (id) => {
    deleteDataFromApi(`/finance/goal/${id}`)
      .then(() => {
        toast.success("Goal deleted");
        fetchGoals();
      })
      .catch(() => toast.error("Failed to delete goal"));
  };

  return (
    <div className="tab-content goals-tab">
      <form className="add-form glass-card" onSubmit={handleAdd}>
        <h3>New Savings Goal</h3>
        <input
          type="text"
          placeholder="Goal name (e.g. Emergency Fund)"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          className="hub-input"
        />
        <div className="form-row">
          <div className="field">
            <label>Target Amount (₹)</label>
            <input
              type="number"
              placeholder="e.g. 50000"
              min="1"
              value={form.targetAmount}
              onChange={(e) =>
                setForm((p) => ({ ...p, targetAmount: e.target.value }))
              }
              className="hub-input"
            />
          </div>
          <div className="field">
            <label>Deadline (optional)</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) =>
                setForm((p) => ({ ...p, deadline: e.target.value }))
              }
              className="hub-input"
            />
          </div>
        </div>
        <button type="submit" className="hub-btn" disabled={loading}>
          {loading ? "Creating..." : "+ Create Goal"}
        </button>
      </form>

      <div className="goals-grid">
        {goals.length === 0 ? (
          <p className="empty-hint">
            No goals yet. Create your first savings goal above.
          </p>
        ) : (
          goals.map((g) => {
            const pct = Math.min((g.savedAmount / g.targetAmount) * 100, 100);
            const circumference = 2 * Math.PI * 36;
            return (
              <div key={g._id} className="goal-card glass-card">
                <button
                  className="delete-btn goal-delete"
                  onClick={() => handleDelete(g._id)}
                >
                  ✕
                </button>
                <div className="goal-ring">
                  <svg viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="36" className="ring-track" />
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      className="ring-fill"
                      strokeDasharray={circumference}
                      strokeDashoffset={
                        circumference - (pct / 100) * circumference
                      }
                    />
                  </svg>
                  <span className="ring-pct">{Math.round(pct)}%</span>
                </div>
                <h4 className="goal-title">{g.title}</h4>
                <p className="goal-amounts">
                  ₹{g.savedAmount.toLocaleString()} of ₹
                  {g.targetAmount.toLocaleString()}
                </p>
                {g.deadline && <p className="goal-deadline">🗓 {g.deadline}</p>}
                <div className="contribute-row">
                  <input
                    type="number"
                    placeholder="Add ₹"
                    min="1"
                    value={contribute[g._id] || ""}
                    onChange={(e) =>
                      setContribute((p) => ({ ...p, [g._id]: e.target.value }))
                    }
                    className="hub-input contribute-input"
                  />
                  <button
                    className="hub-btn-sm"
                    onClick={() => handleContribute(g._id)}
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function InsightsTab() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDataFromApi("/finance/insights", { month: currentMonth })
      .then((res) => setData(res?.data))
      .catch(() => {});
  }, []);

  if (!data)
    return (
      <div className="tab-content">
        <p className="empty-hint">Loading insights...</p>
      </div>
    );

  const { spending, totalSpent, budget, score } = data;
  const maxSpend = Math.max(...Object.values(spending), 1);

  const scoreColor =
    score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : "#f87171";

  return (
    <div className="tab-content insights-tab">
      <div className="insights-top">
        <div className="score-card glass-card">
          <p className="score-label">Financial Health Score</p>
          <p className="score-value" style={{ color: scoreColor }}>
            {score}
            <span>/100</span>
          </p>
          <p className="score-hint">
            {score >= 80
              ? "Great discipline this month!"
              : score >= 50
                ? "On track — keep it up."
                : "Review your spending habits."}
          </p>
        </div>
        <div className="total-card glass-card">
          <p className="score-label">Total Spent</p>
          <p className="score-value">₹{totalSpent.toLocaleString()}</p>
          <p className="score-hint">
            {new Date().toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="spending-chart glass-card">
        <h3>Spending by Category</h3>
        <div className="bar-chart">
          {Object.keys(spending).map((cat) => {
            const spent = spending[cat] || 0;
            const limit = budget[cat] || 0;
            const pct = (spent / maxSpend) * 100;
            const overBudget = limit > 0 && spent > limit;
            return (
              <div key={cat} className="bar-row">
                <span className="bar-label">
                  {DEFAULT_ICONS[cat] || FALLBACK_ICON} {cat}
                </span>
                <div className="bar-track">
                  <div
                    className={`bar-fill ${overBudget ? "over" : ""}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="bar-value">₹{spent.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function EmiCalculatorTab() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [emi, setEmi] = useState(null);

  const calculateEmi = (e) => {
    e.preventDefault();
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(tenure);

    if (p && r && n) {
      const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi({
        monthly: Math.round(emiValue),
        totalInterest: Math.round(emiValue * n - p),
        totalAmount: Math.round(emiValue * n),
      });
    } else {
      toast.error("Please fill all fields correctly");
    }
  };

  return (
    <div className="tab-content emi-tab">
      <form className="add-form glass-card" onSubmit={calculateEmi}>
        <h3>EMI Calculator</h3>
        <div className="form-row">
          <div className="field">
            <label>Principal Amount (₹)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="hub-input"
              placeholder="e.g. 500000"
            />
          </div>
          <div className="field">
            <label>Interest Rate (p.a. %)</label>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="hub-input"
              placeholder="e.g. 8.5"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Tenure (Months)</label>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="hub-input"
              placeholder="e.g. 60"
            />
          </div>
        </div>
        <button type="submit" className="hub-btn">Calculate</button>
      </form>

      {emi && (
        <div className="insights-top" style={{ marginTop: "20px" }}>
          <div className="score-card glass-card">
            <p className="score-label">Monthly EMI</p>
            <p className="score-value">₹{emi.monthly.toLocaleString()}</p>
          </div>
          <div className="total-card glass-card">
            <p className="score-label">Total Interest</p>
            <p className="score-value">₹{emi.totalInterest.toLocaleString()}</p>
          </div>
          <div className="total-card glass-card">
            <p className="score-label">Total Amount</p>
            <p className="score-value">₹{emi.totalAmount.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Hub ─────────────────────────────────────────────────────

const TABS = [
  { id: "track", label: "Track", icon: "📝" },
  { id: "budget", label: "Budget", icon: "📊" },
  { id: "goals", label: "Goals", icon: "🎯" },
  { id: "insights", label: "Insights", icon: "💡" },
  { id: "emi", label: "EMI Calc", icon: "🧮" },
];

const FinancialHub = () => {
  const [activeTab, setActiveTab] = useState("track");
  // Shared budget state — fetched once, passed to both BudgetTab & TrackTab
  const [budgetData, setBudgetData] = useState({
    categories: {},
    categoryIcons: {},
  });

  useEffect(() => {
    fetchDataFromApi("/finance/budget", { month: currentMonth })
      .then((res) => {
        if (res?.data) {
          setBudgetData({
            categories: res.data.categories || {},
            categoryIcons: res.data.categoryIcons || {},
          });
        }
      })
      .catch(() => {});
  }, []);

  const categoryList = Object.keys(budgetData.categories);

  return (
    <div className="financial-hub">
      <div className="hub-bg-glow" />
      <BackButton />

      <div className="hub-container">
        <div className="hub-hero">
          <span className="hub-badge">Financial Wellness</span>
          <h1>
            My Finance <span>Hub</span>
          </h1>
          <p>Track spending, stick to your budget, and grow your savings.</p>
        </div>

        <div className="hub-tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`hub-tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span className="tab-icon">{t.icon}</span>
              <span className="tab-label">{t.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "track" && (
          <TrackTab
            categoryList={categoryList}
            categoryIcons={budgetData.categoryIcons}
          />
        )}
        {activeTab === "budget" && (
          <BudgetTab budgetData={budgetData} onBudgetSaved={setBudgetData} />
        )}
        {activeTab === "goals" && <GoalsTab />}
        {activeTab === "insights" && <InsightsTab />}
        {activeTab === "emi" && <EmiCalculatorTab />}
      </div>
    </div>
  );
};

export default FinancialHub;
