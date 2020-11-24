while :
do
    echo "Updating songs database"

    python3 update.py;
    python3 getSongs.py;
    python3 getAllCovers.py;

    sleep 2m
done
