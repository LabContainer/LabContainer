# Standardized student env

To be managed by kubrnetes

## Kubernetes Notes

Developing based on `minikube` - Recommended to install

```bash
# Create deployment of student env, options for replicas
kubectl create deployment studentenv --image=studentenv:latest

# Every lab will have own student env image

# Connecting to pods via SSH
# Pods are in the same virtual subnet as the entire cluster, hence its important to deploy Auth,Student,Management services via kubernetes as well to ensure commication between all 

# From Inside services kubectl may not run so we have to use kubernetes REST api on the master node to manage the cluster

# When student logs in, increasing replicas
kubectl scale deployment web --replicas=$Currently_Logged_in_users
# find pod name, ip to put in analytics db to assign to user

# When user logs out removing the pod
kubectl get pod # look in aut db for correct podname to remove
kubectl delete pod <podname>
kubectl scale deployment web --replicas=$Reduced_user_count
```
