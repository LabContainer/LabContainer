gcloud compute instances create labcontainer \
--metadata-from-file=startup-script=startup.sh \
--scopes=compute-rw --machine-type=e2-standard-4