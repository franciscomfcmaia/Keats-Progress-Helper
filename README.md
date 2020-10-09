

# Keats Progress Helper
**Welcome**. This is a small and simple chrome extension that adds checkboxes in front of every "Activity."

Keats creates things called **"Activity Instances"** for each Lecture, Assignment, Quiz, etc...

This extension simply parses them and saves the progress of each completed task in chrome's local storage.

Please feel free to start an issue if one is found. Below is a cheat sheet on how to report a bug.

## Installation

Releases can be found here : https://github.com/franciscomfcmaia/Keats-Progress-Helper/releases

Because this extensions is not yet on the chrome store (might take some days). Follow these instructions :

1.  Download a release and unzip to a place of your choice.
2.  Visit  `chrome://extensions`  (via omnibox or menu -> Tools -> Extensions).
3.  Enable Developer mode by ticking the checkbox in the upper-right corner.
4.  Click on the "Load unpacked extension..." button.
5.  Select the directory containing your  **unpacked**  released.

## Changelog 0.1 [Staging]

|Functionality| Status   | Comments |
|--|--|--|
| Storing Progress Across Modules | <font color='green'>Implemented</font> | <font color='red'>Staging</font> |
| Badge For Quick Progress Display | <font color='green'>Implemented</font> | <font color='red'>Staging</font> |
| Storing to Chrome's "Sync Storage" | <font color='red'>Not Implemented</font> | <font color='red'>Currently no sync across devices</font> |


## Feature and Bug reporting [Best Practices]

All Bugs encountered in staging must be reported to **jira**!
> **You should have access to jira. It is best to use the ios app, super practical for quick bug reporting!**

**Given below are the important features in the Bug report:**

#### 1) Bug Title

A Bug title is read more often than any other part of the bug report. It should say all about what comes in the bug.

The Bug title should be suggestive enough that the reader can understand it. A clear bug title makes it easy to understand and the reader can know if the bug has been reported earlier or has been fixed.

#### 2) Priority

Based on the severity of the bug, a priority can be set for it. A bug can be a Blocker, Critical, Major, Minor, Trivial, or a suggestion. A bug priority from P1 to P5 can be given so that the important ones are viewed first.

#### 3) Platform/Environment

The OS and browser configuration is necessary for a clear bug report. It is the best way to communicate how the bug can be reproduced.

Without the exact platform or environment, the application may behave differently and the bug at the tester’s end may not replicate on the developer’s end. So it is best to mention clearly the environment in which the bug was detected.

#### 4) Description

Bug description helps the developer to understand the bug. It describes the problem encountered. The poor description will create confusion and waste the time of the developers and the testers as well.

It is necessary to communicate clearly about the effect of the description. It’s always helpful to use complete sentences. It is a good practice to describe each problem separately instead of crumbling them altogether. Don’t use terms like “I think” or “I believe”.

#### 5) Steps to Reproduce

A good Bug report should clearly mention the steps to reproduce. The steps should include actions that cause the bug. Don’t make generic statements. Be specific in the steps to follow.

**A good example of a well-written procedure is given below**

**Steps:**

-   Select product Abc01.
-   Click on Add to cart.
-   Click Remove to remove the product from the cart.

#### 6) Expected and Actual Result

A Bug description is incomplete without the Expected and Actual results. It is necessary to outline what is the outcome of the test and what the user should expect. The reader should know what the correct outcome of the test is. Clearly, mention what happened during the test and what was the outcome.

#### 7) Screenshot

A picture is worth a thousand words. Take a Screenshot of the instance of failure with proper captioning to highlight the defect. Highlight unexpected error messages with light red color. This draws attention to the required area.

# Bug report template cheat sheet

This is a simple Bug report format. It may vary depending upon the Bug report tool that you are using. If you are writing a bug report manually then some fields need to be mentioned specifically like the Bug number, which should be assigned manually.

**Reporter:** Your name and email address.

**Product:**  In which product you found this bug.

**Version:** The product version if any.

**Component:**  These are the major sub-modules of the product.

**Priority:** When should a bug be fixed? Priority is generally set from P1 to P5. P1 as “fix the bug with the highest priority” and P5 as ” Fix when time permits”.

**Severity:** This describes the impact of the bug.  
**Types of Severity:**

-   **Blocker:**  No further testing work can be done.
-   **Critical:**  Application crash, Loss of data.
-   **Major:**  Major loss of function.
-   **Minor:**  Minor loss of function.
-   **Trivial:**  Some UI enhancements.
-   **Enhancement:** Request for a new feature or some enhancement in the existing one.

**Status:** When you are logging the bug into any bug tracking system then by default the bug status will be ‘New'.  
Later on, the bug goes through various stages like Fixed, Verified, Reopen, Won't Fix, etc.

**Assign To:** If you know which developer is responsible for that particular module in which the bug occurred, then you can specify the email address of that developer. Else keep it blank as this will assign the bug to the module owner if not the Manager will assign the bug to the developer. Possibly add the manager's email address in the CC list.

**URL:** The page URL on which the bug occurred.

**Summary:** A brief summary of the bug mostly in 60 words or below. Make sure your summary is reflecting on what the problem is and where it is.

**Description:** A detailed description of the bug.

**Use the following fields for the description field:**

-   **Reproduce steps:**  Clearly, mention the steps to reproduce the bug.
-   **Expected result:**  How the application should behave on the above-mentioned steps.
-   **Actual result:**  What is the actual result of running the above steps i.e. the bug behavior.

These are the important steps in the bug report. You can also add the “Report type” as one more field which will describe the bug type.

**Report types include:**

1) Coding error  
2) Design error  
3) New Suggestion  
4) Documentation issue  
5) Hardware problem
