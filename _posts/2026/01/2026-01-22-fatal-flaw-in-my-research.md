---
layout: post
title:  "Fatal Flaw in My Research"
date:   2026-01-22 17:08:00 +0900
categories: blog
---

Yesterday, I learn about website called ![https://paperreview.ai/review](paperreview.ai). This website help me pointing out the  weakness and the issue behind the paper of my research. After I read and check all the comments, I found out  in my research that the dataset I make is not right in the physics theory. Its wrong because it mix the continuous value (CV) with discrete value (DV). It uses wigner function that is mainly using continuous value to number of qubit which are mainly discrete. 

I actually feel burdened after that and just sleep to rest my brain from all the sudden issue that come out to my brain. Then, I found the fix of it. But, the fix need to make changes of the dataset. This change of dataset need to happen immediately to make all the training start faster and make the result also showing faster. Right now, I'm trying to fix the idea and dataset behind all the wigner function. THe steps are here:

1. Change the generator file and make sure all the parameter and ground truth saved in csv.
2. Generate all the thinking using GPT or Gemini. Give the prompt and last example from it to the Gemini or GPT to make it more understandable to make the thinking ability. 
3. Populaate the dataset with the same structure as the last  wigner dataset combined.  Make sure the total number of row is higher or at least same as before.



