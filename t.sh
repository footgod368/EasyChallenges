read commitMsg
$(echo -e 'git add .\n')
$(echo -e 'git commit -m $commitMsg\n')
$(echo -e 'git push\n')
