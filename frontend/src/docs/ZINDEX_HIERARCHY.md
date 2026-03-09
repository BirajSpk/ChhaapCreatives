/**
 * ============================================
 * GLOBAL Z-INDEX STACKING CONTEXT HIERARCHY
 * ============================================
 * 
 * This document outlines the complete z-index strategy
 * for the Chhaap Creatives application.
 * 
 * Issue Fixed:
 * - Modals appearing behind headers, sidebars, and background UI
 * - Inconsistent z-index values across modal components
 * - Transform properties creating unintended stacking contexts
 * - Backdrop not sitting properly below modals
 * 
 * ============================================
 * Z-INDEX HIERARCHY
 * ============================================
 */

/* 
 * BASE CONTENT LAYER: 0-50
 * Regular page content and elements without special stacking
 */
--z-base: 0;              /* Default content */
--z-content: 10;          /* Page content with slight elevation */
--z-dropdown: 30;         /* Regular dropdown menus from content */

/* 
 * HEADER & NAVIGATION LAYER: 100
 * Fixed navigation bars and sticky headers above content
 * Must be above base content but below overlays
 */
--z-navbar: 100;          /* Fixed navbar (top navigation) */
--z-header-sticky: 100;   /* Sticky header in admin layouts */

/* 
 * SIDEBAR LAYERS: 199-200
 * Mobile overlays and sidebar navigation
 * When mobile menu opens, backdrop sits below sidebar
 */
--z-sidebar-overlay: 199; /* Mobile menu backdrop */
--z-sidebar: 200;         /* Fixed/sticky sidebar */

/* 
 * MODAL & DIALOG LAYERS: 900-1010+
 * All overlay dialogs, modals, and popups
 * Backdrop serves as semi-transparent barrier between page and modal
 */
--z-backdrop: 900;        /* Background dimming for modals */
--z-modal: 1000;          /* Main modal/dialog container */
--z-modal-header-sticky: 1010;  /* Sticky header inside modal (above modal body when scrolling) */

/* 
 * TOP LAYER: 2000+
 * Toast notifications, tooltips, and highest-priority UI
 */
--z-toast-notification: 2000;  /* Toast messages, alerts */
--z-tooltip: 2500;        /* Hover tooltips and popovers */

/**
 * ============================================
 * IMPLEMENTATION GUIDELINES
 * ============================================
 */

/*
 * MODAL STRUCTURE (CORRECT):
 * 
 * <div className="fixed inset-0 z-[1000] flex items-center justify-center">
 *   {/* Backdrop - positioned absolutely, uses negative z-index */}
 *   <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[-1]" />
 *   
 *   {/* Modal Content */}
 *   <div className="relative border rounded-lg">
 *     {/* Modal Header - sticky with higher z-index when scrolling */}
 *     <div className="sticky top-0 z-[1010]">Header</div>
 *     
 *     {/* Modal Body - scrollable */}
 *     <div className="overflow-y-auto">Content</div>
 *   </div>
 * </div>
 * 
 * Why this works:
 * 1. Wrapper (z-[1000]) creates stacking context above page
 * 2. Backdrop (z-[-1]) sits below sibling modal content
 * 3. Modal header (z-[1010]) stays above scrolling body
 * 4. No nested stacking contexts - flat hierarchy
 */

/*
 * COMMON MISTAKES TO AVOID:
 * ❌ <div className="z-[100]"> for modal (too low)
 * ❌ <div className="sticky top-0 lg:translate-x-0"> (transform creates stacking context)
 * ❌ <div className="overflow-hidden"> on parent of modal (traps fixed positioning)
 * ❌ Different z-index for wrapper and content (e.g., wrapper z-[100], content z-10)
 * ❌ Backdrop as sibling with lower z-index than modal (use absolute + negative z)
 */

/*
 * FIXED ISSUES IN CODEBASE:
 * 
 * 1. AdminBlogs.jsx
 *    - Before: z-50 wrapper, z-50 modal, z-10 header
 *    - After: z-[1000] wrapper, z-[-1] backdrop, z-[1010] header
 *    - Issue: Backdrop had no z-index, appeared above modal
 * 
 * 2. AdminProducts.jsx
 *    - Before: z-[100] wrapper, z-10 modal with relative positioning
 *    - After: z-[1000] wrapper, z-[-1] absolute backdrop, flex layout
 *    - Issue: Inconsistent z-index values
 * 
 * 3. AdminServices.jsx
 *    - Before: z-[100] wrapper, z-10 modal
 *    - After: z-[1000] wrapper, z-[-1] backdrop
 *    - Issue: Modal z-index too low relative to wrapper
 * 
 * 4. AdminCategories.jsx
 *    - Before: z-50 wrapper, z-40 backdrop, z-50 modal, z-10 header
 *    - After: z-[1000] wrapper, z-[-1] backdrop, z-[1010] header
 *    - Issue: Inconsistent methodology
 * 
 * 5. AdminLayout.jsx
 *    - Before: Sidebar z-50 with transform (lg:translate-x-0), header z-30
 *    - After: Sidebar z-[200], header z-[100], removed transform on lg
 *    - Issue: Transform property creates new stacking context, interferes with modals
 * 
 * 6. Navbar.jsx
 *    - Before: z-50
 *    - After: z-[100]
 *    - Issue: Should match header standard layer
 */

/*
 * BROWSER STACKING CONTEXT RULES:
 * 
 * A stacking context is created by:
 * 1. z-index value (other than auto) + positioned element
 * 2. An opacity value less than 1
 * 3. A transform property (translate, scale, rotate, skew)
 * 4. A filter property
 * 5. backdrop-filter property
 * 6. Will-change with above values
 * 7. mix-blend-mode (other than normal)
 * 
 * When a stacking context is created, it:
 * - Becomes its own stacking level
 * - Children with z-index values are relative to parent, not page
 * - Parent's z-index matters for where context appears on page
 */

/*
 * CSS VARIABLES APPLIED:
 * All values now defined in index.css :root selector
 * Can be referenced as: z-[var(--z-modal)], etc.
 * Currently hardcoded as z-[1000], z-[900], etc. for Tailwind compatibility
 */
