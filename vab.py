import requests
import logging
import pipes
import pwd
import os

CODESHIP_API = ""
CODESHIP_KEY = ""

SLACK_API = "https://slack.com/api/"
SLACK_TOKEN = ""

GITHUB_API = "https://api.github.com/"
GITHUB_TOKEN = ""
GITHUB_OWNER = "planetary"


class SlackError(Exception):
    pass


def slack_api_call(method, **kwargs):
    """
    Runs `method` against the Slack API using `SLACK_TOKEN`, returning the
    server response on success.

    Throws a RequestException if the server did not reply in time or if the
    status code wasn't 200-ish
    Throws a ValueError if the server did not reply with a JSON structure.
    Throws a SlackError if the server replied with ok:false
    """
    kwargs["token"] = SLACK_TOKEN
    response = requests.post(SLACK_API + method, params=kwargs)
    response.raise_for_status()
    data = response.json()
    if not data["ok"]:
        raise SlackError(data["error"])
    del data["ok"]
    return data


def create_channel(name, description):
    result = slack_api_call("channels.create", name=name)
    channel = result["channel"]["id"]

    slack_api_call("channels.setPurpose", channel=channel, purpose=description)

    """for user in slack_api_call("users.list")["members"]:
        if user["deleted]
            continue
        slack_api_call("channels.invite", channel=channel, user=user["id"])"""


def create_repo(name, description, private=True):
    response = requests.get("{0}repos/{1}/{2}".format(GITHUB_API,
                                                      GITHUB_OWNER,
                                                      name))

    if response.status != 404:
        logging.info("Repository already exists")
        return response  # already exists

    logging.info("Creating github repo '{0}'".format(name))
    return requests.post("{0}orgs/{1}/repos".format(GITHUB_API, GITHUB_OWNER),
                         params={"name": name,
                                 "description": description,
                                 "private": "true" if private else "false"},
                         headers={"Accept": "application/vnd.github.v3+json",
                                  "Authorization": "token " + GITHUB_TOKEN})


def add_deploy_key(repo, key):
    return requests.post("{0}repos/{1}/{2}/keys".format(GITHUB_API,
                                                        GITHUB_OWNER,
                                                        repo),
                         params={"title": "vab",
                                 "key": key},
                         headers={"Accept": "application/vnd.github.v3+json",
                                  "Authorization": "token " + GITHUB_TOKEN})


def create_user(name, description):
    # add user
    logging.info("Adding user")
    os.system('useradd -b /projects -c {0} -G projects -m {1}'.format(
        pipes.quote(description),
        pipes.quote(name)
    ))
    user = pwd.getpwnam(name)

    # create key pair
    logging.info("Creating keypair")
    ssh = os.path.join(user.pw_dir, ".ssh")
    pri_key = os.path.join(ssh, "id_rsa")
    pub_key = os.path.join(ssh, "id_rsa.pub")
    os.system('ssh-keygen -f {0} -t rsa -b 4096 -C {1} -N ""'.format(
        pipes.quote(pri_key),
        pipes.quote("{0}@planetary.io".format(name))
    ))

    # change ownership
    os.chown(ssh, user.pw_uid, user.pw_gid)
    os.chown(pri_key, user.pw_uid, user.pw_gid)
    os.chown(pub_key, user.pw_uid, user.pw_gid)

    return open(pub_key).read()
