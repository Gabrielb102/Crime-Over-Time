from flask import Flask, request, flash, request, render_template, redirect, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, User, Favorite, Query
from forms import QueryForm, offenses_tuples
from requests_cache import CachedSession
import requests
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = "SECRET_KEY"
app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql:///crime_over_time"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

debug = DebugToolbarExtension(app)

connect_db(app)

session = CachedSession('cache_1', 'sqlite', 7776000)
api_url = 'https://api.usa.gov/crime/fbi/sapi/'
base_endpoint = 'api/data/nibrs/'
headers = {'x-api-key': 'her0c01v93zfPIBouBZkcuHKyhshiZKsOC7d4VZh'}

@app.route('/', methods=['GET', 'POST'])
def show_home():
    form = QueryForm()
    offense = form.offense.data
    info = form.info.data
    scope = form.scope.data
    location = form.location.data
    variable = form.data.data
    return render_template('home.html', form=form)

@app.route('/results')
def call_api():
    form = QueryForm()
    offense = form.offense.data
    info = form.info.data
    scope = form.scope.data
    location = form.location.data
    variable = form.data.data

    full_request_url = f"{api_url}{base_endpoint}{offense}/{info}/{scope}/{location}/{variable}"
    print(full_request_url)
    request = session.get(full_request_url, headers=headers)

    return jsonify(request.json)        


@app.route('/agencies')
def return_offenses():
    """returns a list of agencies to be utilized by the on-page JS"""
    raw_req = session.get(f'{api_url}api/agencies', headers=headers)
    ori_list = []
    agency_list = []
    agency_json = raw_req.json()
    for key in agency_json.keys():
        for ori in agency_json[key]:
            ori_list.append(agency_json[key][ori]['ori'])
            agency_list.append(agency_json[key][ori]['agency_name'])
    agency_options = [(ori_list[n], agency_list[n]) for n in range(len(ori_list))]
    return jsonify(agency_options)
