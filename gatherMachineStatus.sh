echo "host: `hostname | cut -d '.' -f 1`"
echo "uptime: `uptime | cut -d ',' -f 1 | cut -b 14-`"
echo "cpu: `cat /proc/cpuinfo | grep processor | wc -l`"
echo "load: `uptime | cut -d ',' -f 3- | cut -d ':' -f 2 | sed 's/^[ \t]*//g'`"
echo "/var/fpwork: `df /var/fpwork | tail -n 1 | awk '{print $5}'`"
echo "user: `who | awk '{print $1}' | sort | uniq | sed ':label;N;s/\n/ /;b label'`"

