# Clash Ext — 项目需求规格

## 1. 项目概述

Clash Ext 是一套 Clash/Mihomo 代理分流覆写脚本与配置集合，用于在现有代理配置之上动态注入 Gemini/ICU 分流规则、广告屏蔽规则以及自动选路的策略组。

**支持平台**：Mihomo Party / Clash Verge Rev（JS 覆写脚本）、Stash（YAML 覆写配置）

---

## 2. 核心需求

### 2.1 规则提供者

| 规则集 | 类型 | 行为 | 更新间隔 | 来源 |
|--------|------|------|----------|------|
| Gemini | HTTP | classical | 86400s（1天） | blackmatrix7/ios_rule_script |
| YouTube（仅 Stash） | HTTP | classical | 86400s | blackmatrix7/ios_rule_script |
| 广告/跟踪屏蔽 | HTTP | domain | 86400s | Loyalsoldier/clash-rules |

规则提供者需从远程 CDN 自动拉取，保持规则集与上游同步。

### 2.2 策略组

#### OpenRouter 策略组

- **类型**：url-test（自动测速选路）
- **测速目标**：JS 脚本无显式指定；Stash 使用 `http://www.gstatic.com/generate_204`
- **测速间隔**：600s
- **容差**：50ms
- **节点筛选规则**：
  - `mojie.js`：名称包含 "美国" 或 "新加坡" 的节点
  - `icu.js`：名称包含 "icu"（忽略大小写）的节点
  - `stash.stoverride`：filter 正则 `(美国|新加坡)`
- **懒加载**（仅 Stash）：`lazy: true`

#### YouTube 策略组（仅 Stash）

- **类型**：url-test
- **测速目标**：`http://www.gstatic.com/generate_204`
- **测速间隔**：600s，容差 50ms
- **节点筛选**：排除名称含 "日本" 的节点（`^(?!.*日本)`）
- **懒加载**：`lazy: true`

### 2.3 分流规则优先级

规则按以下优先级注入（`unshift` 保证由前到后优先级由高到低）：

| 优先级 | 规则 | 动作 |
|--------|------|------|
| 1（最高） | `RULE-SET,reject` | REJECT（广告/跟踪屏蔽） |
| 2 | Stash: `RULE-SET,youtube` → youtube 组 / JS: `DOMAIN-KEYWORD,openrouter.ai` | OpenRouter |
| 3 | `DOMAIN-KEYWORD,openrouter.ai` | OpenRouter（JS 版；Stash 为优先级 3） |
| 4 | `RULE-SET,gemini` | OpenRouter（Gemini 流量走 OpenRouter） |

> **Stash 规则顺序**：REJECT → YouTube → openrouter.ai → Gemini
> **JS 脚本规则顺序**：REJECT → openrouter.ai → Gemini（无 YouTube 规则）

### 2.4 节点过滤

所有代理组中名称包含 "日本" 的节点需被移除（通过遍历 `proxy-groups` 的 `proxies` 数组实现）。

**范围**：仅 JS 覆写脚本；Stash 在策略组中通过 `filter` 字段实现，无需额外遍历。

---

## 3. 平台差异

| 特性 | mojie.js | icu.js | stash.stoverride |
|------|----------|--------|------------------|
| 节点筛选关键字 | 美国、新加坡 | icu | 美国、新加坡 |
| YouTube 策略组 | ❌ | ❌ | ✅ |
| YouTube 规则集 | ❌ | ❌ | ✅ |
| 日本节点过滤方式 | 遍历 proxy-groups | 遍历 proxy-groups | 策略组 filter 正则 |
| OpenRouter 测速 URL | 无（依赖下游） | 无（依赖下游） | gstatic.com |
| lazy 加载 | ❌ | ❌ | ✅ |
| include-all | ❌ | ❌ | ✅ |

---

## 4. 非功能性需求

- **兼容性**：JS 脚本必须兼容 Mihomo Party / Clash Verge Rev 的覆写 API（`main(config)` 签名，返回修改后的 config）
- **幂等性**：重复执行覆写脚本不产生重复规则/策略组
- **低侵入**：不破坏用户已有的 `proxies`、`proxy-groups`、`rules`、`rule-providers` 配置，仅做追加和过滤
- **规则来源可追溯**：README 中明确标注规则集的 GitHub 来源

---

## 5. 外部依赖

| 依赖 | URL | 用途 |
|------|-----|------|
| blackmatrix7/ios_rule_script | jsdelivr CDN | Gemini / YouTube 规则集 |
| Loyalsoldier/clash-rules | jsdelivr CDN | 广告/跟踪域名屏蔽列表 |

---

## 6. 目录结构

```
clash_ext/
├── mojie.js          # Gemini 分流覆写脚本（美国/新加坡节点）
├── icu.js            # ICU 分流覆写脚本（icu 节点）
├── stash.stoverride  # Stash YAML 覆写配置
├── README.md         # 项目说明
└── spec.md           # 本文件
```
