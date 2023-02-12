echo abc

echo 1
echo '*.*'

echo 2
q=`echo '*.*'`
echo $q

echo 3
q=$('*.*')
echo $q

echo 4
q='*'
q+='.'
q+='*'
echo 'echo now ....'
echo ${q}
echo 'echo 2 now ...'
echo "$q"
echo 'DONE'