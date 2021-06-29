read commitMsg
$(echo git add .)
$(echo git commit -m "$commitMsg")
$(echo git push)
